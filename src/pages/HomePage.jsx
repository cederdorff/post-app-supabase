import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Aurora,
  Button,
  EyebrowPill,
  FloatingSparkles,
  GradientText,
  PromptHero,
  StatCounter,
  StatusDot,
  StickyBanner,
  TokenStream,
  WordRoll
} from "performative-ui";
import PostCard from "../components/PostCard";
import StatusPanel from "../components/StatusPanel";
import { listPosts } from "../lib/postsApi";

export default function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadPosts = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await listPosts();
      setPosts(data);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message || "The feed could not be loaded.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function handlePromptSubmit(value) {
    if (!value.trim()) return;
    navigate(`/create?caption=${encodeURIComponent(value.trim())}`);
  }

  return (
    <main className="performative-app">
      <section className="performative-hero">
        <Aurora animated blur={64} className="performative-aurora" />
        <FloatingSparkles className="performative-sparkles" count={24} />

        <div className="performative-hero-content">
          <StickyBanner>Now streaming: full performative CRUD mode</StickyBanner>

          <EyebrowPill statusColor="#4ade80">Post App Lab</EyebrowPill>

          <h1 className="performative-title">
            Publish for <WordRoll words={["founders", "builders", "hackers"]} gradient />
            <br />
            <GradientText as="span">with unreasonable visual confidence</GradientText>
          </h1>

          <p className="performative-subtitle">
            <TokenStream text="Start with a one-line caption and jump straight into your Create flow." />
          </p>

          <PromptHero placeholder="Write your caption idea..." ctaLabel="Draft post" onSubmit={handlePromptSubmit} />

          <div className="performative-hero-actions">
            <Button as={Link} to="/create" variant="glow" sparkle>
              Create New Post
            </Button>
          </div>
        </div>
      </section>

      <section className="performative-feed">
        <div className="performative-feed-header">
          <h2>Live Feed</h2>
          <p>
            <StatusDot /> <StatCounter target={posts.length} /> active posts
          </p>
        </div>

        {status === "loading" && <StatusPanel title="Loading posts">Fetching the latest feed.</StatusPanel>}

        {status === "error" && (
          <StatusPanel tone="danger" title="Could not load posts" actionLabel="Try again" onAction={loadPosts}>
            {errorMessage}
          </StatusPanel>
        )}

        {status === "success" && posts.length === 0 && (
          <StatusPanel
            tone="warning"
            title="No posts yet"
            actionLabel="Create the first post"
            actionTo="/create"
          >
            Draft a caption, add an image, and it will appear in the feed.
          </StatusPanel>
        )}

        {status === "success" && posts.length > 0 && (
          <section className="post-grid" aria-label="Posts">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
