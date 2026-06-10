import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Aurora,
  Button,
  EyebrowPill,
  FloatingSparkles,
  GradientText,
  PromptHero,
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
  const heroPosts = posts.filter((post) => post.image).slice(0, 3);
  const latestPost = posts[0];

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
    let ignore = false;

    async function loadInitialPosts() {
      try {
        const data = await listPosts();

        if (ignore) return;

        setPosts(data);
        setStatus("success");
      } catch (error) {
        if (ignore) return;

        setErrorMessage(error.message || "The feed could not be loaded.");
        setStatus("error");
      }
    }

    loadInitialPosts();

    return () => {
      ignore = true;
    };
  }, []);

  function handlePromptSubmit(value) {
    if (!value.trim()) return;
    navigate(`/create?caption=${encodeURIComponent(value.trim())}`);
  }

  return (
    <main className="performative-app">
      <section className="performative-hero">
        <Aurora animated blur={64} className="performative-aurora" />
        <FloatingSparkles className="performative-sparkles" count={24} />

        <div className="performative-hero-layout">
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

          <aside className="hero-showcase" aria-label="Post feed preview">
            <div className="hero-showcase-header">
              <span>
                <StatusDot /> Live feed
              </span>
              <strong>{posts.length}</strong>
            </div>

            <div className="hero-stack">
              {heroPosts.length > 0 ? (
                heroPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/${post.id}`}
                    className={`hero-stack-item hero-stack-item-${index + 1}`}
                  >
                    <img src={post.image} alt={post.caption || `Post ${post.id}`} />
                  </Link>
                ))
              ) : (
                <div className="hero-stack-empty">Draft-ready</div>
              )}
            </div>

            <div className="hero-showcase-footer">
              <span>Latest record</span>
              <strong>{latestPost ? `#${latestPost.id}` : "Waiting"}</strong>
            </div>
            <p>{latestPost?.caption || "Create the first post and it will land here."}</p>
          </aside>
        </div>
      </section>

      <section className="feed-summary" aria-label="Feed summary">
        <div>
          <span>Posts</span>
          <strong>{posts.length}</strong>
        </div>
        <div>
          <span>Latest</span>
          <strong>{latestPost ? `#${latestPost.id}` : "-"}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{status === "success" ? "Live" : status}</strong>
        </div>
      </section>

      <section className="performative-feed">
        <div className="performative-feed-header">
          <div>
            <EyebrowPill statusColor="#38bdf8">Gallery</EyebrowPill>
            <h2>Live Feed</h2>
          </div>
          <p>
            <StatusDot /> {posts.length} active posts
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
