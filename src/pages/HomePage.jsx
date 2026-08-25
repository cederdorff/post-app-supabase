import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getAll } from "../services/postService";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const posts = await getAll();
      setPosts(posts);
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
