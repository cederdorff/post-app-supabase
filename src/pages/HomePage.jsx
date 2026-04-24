import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { URL, headers } from "../lib/api";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getPosts() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(URL, { headers });

        if (!response.ok) {
          throw new Error("Kunne ikke hente posts.");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Kunne ikke hente posts.");
      } finally {
        setIsLoading(false);
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

      {isLoading && <p className="status-message">Loading posts...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!isLoading && !errorMessage && posts.length === 0 && (
        <p className="status-message">Der er ingen posts endnu.</p>
      )}

      <section className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
