import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const POSTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/posts`;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("created_at.desc");

  useEffect(() => {
    async function getPosts() {
      const params = new URLSearchParams(); // Create URLSearchParams object to build query string

      if (searchText.trim()) {
        params.set("caption", `ilike.*${searchText.trim()}*`); // Add search filter if searchText is not empty
      }

      params.set("order", sort); // Add sorting parameter

      const response = await fetch(`${POSTS_URL}?${params}`, { headers }); // Fetch posts with query parameters
      const data = await response.json(); // Parse response as JSON
      setPosts(data); // Update state with fetched posts
    }

    getPosts();
  }, [searchText, sort]); // Re-run effect whenever searchText or sort changes

  function resetFilters() {
    setSearchText("");
    setSort("created_at.desc");
  }

  return (
    <main className="app">
      <section className="feed-intro">
        <p className="feed-eyebrow">Post App</p>
        <h1 className="page-title">Explore the latest posts</h1>
        <div className="feed-controls">
          <div className="form-field">
            <label htmlFor="search-posts">Search captions</label>
            <input
              id="search-posts"
              type="search"
              placeholder="Try Aarhus or coffee..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="sort-posts">Sort posts</label>
            <select id="sort-posts" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="created_at.desc">Newest first</option>
              <option value="created_at.asc">Oldest first</option>
              <option value="caption.asc">Caption A-Z</option>
              <option value="caption.desc">Caption Z-A</option>
            </select>
          </div>

          <button type="button" className="btn btn-primary" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      </section>

      <section className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
