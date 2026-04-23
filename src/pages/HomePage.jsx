import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(URL, { headers });
      const data = await response.json();
      setPosts(data);
    }

    getPosts();
  }, []);

  return (
    <main className="app">
      <section className="feed-intro">
        <p className="feed-eyebrow">Post App</p>
        <h1 className="page-title">Explore the latest posts</h1>
      </section>

      <section className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
