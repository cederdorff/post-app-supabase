import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(URL, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (caughtError) {
        console.error(caughtError);
        setError("We could not load the posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, []);

  return (
    <main className="app">
      <section className="feed-intro">
        <p className="feed-eyebrow">Post App</p>
        <h1 className="page-title">Explore the latest posts</h1>
      </section>

      {loading && <p className="status-message">Loading posts...</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <section className="empty-state">
          <h2>No posts yet</h2>
          <p>Create the first post to get started.</p>
        </section>
      )}

      {!loading && !error && posts.length > 0 && (
        <section className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </main>
  );
}
