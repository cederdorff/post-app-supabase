import { useEffect, useState } from "react";
import PageHeading from "../components/PageHeading";
import PostCard from "../components/PostCard";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(URL, { headers });
      const data = await response.json();
      setPosts(data);
      setIsLoading(false);
    }

    getPosts();
  }, []);

  return (
    <main className="app" id="main-content">
      <section className="feed-intro">
        <p className="feed-eyebrow">Post App</p>
        <PageHeading title="Explore the latest posts" />
      </section>

      <section className="post-grid" aria-labelledby="latest-posts-heading">
        <h2 className="visually-hidden" id="latest-posts-heading">
          Latest posts
        </h2>
        {isLoading ? (
          <p className="status-message" role="status">
            Loading posts…
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </main>
  );
}
