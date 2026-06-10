import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Aurora, Button, EyebrowPill, GradientText, StatusDot } from "performative-ui";
import PostCard from "../components/PostCard";
import StatusPanel from "../components/StatusPanel";
import { listPosts } from "../lib/postsApi";

export default function HomePage() {
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

  return (
    <main className="performative-app">
      <section className="performative-hero">
        <Aurora blur={56} className="performative-aurora" />

        <div className="performative-hero-content">
          <EyebrowPill statusColor="#4ade80">Post App Lab</EyebrowPill>

          <h1 className="performative-title">
            Simple posts, <GradientText as="span">cleanly presented.</GradientText>
          </h1>

          <p className="performative-subtitle">
            Create image posts with captions, edit them when needed, and keep the feed easy to scan.
          </p>

          <div className="performative-hero-actions">
            <Button as={Link} to="/create" variant="glow" sparkle>
              Create Post
            </Button>
            <Button as={Link} to="#feed" variant="ghost">
              View Feed
            </Button>
          </div>
        </div>
      </section>

      <section className="performative-feed" id="feed">
        <div className="performative-feed-header">
          <div>
            <h2>Posts</h2>
            <p>Latest records from Supabase.</p>
          </div>
          <p>
            <StatusDot /> {posts.length} posts
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
