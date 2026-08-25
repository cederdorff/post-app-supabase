import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(`${URL}?id=eq.${id}`, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const post = data[0];

        if (!post) {
          throw new Error("Post not found");
        }

        setPost(post);
      } catch (caughtError) {
        console.error(caughtError);
        setError("We could not load the post. Please try again.");
      }
    }

    getPost();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;
    setError("");

    try {
      const response = await fetch(`${URL}?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      navigate("/");
    } catch (caughtError) {
      console.error(caughtError);
      setError("We could not delete the post. Please try again.");
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Post Details</h1>
      {error && <p className="error-message" role="alert">{error}</p>}

      {post && (
        <article className="post-detail">
          <img src={post.image} alt={post.caption} />
          <div className="post-detail-body">
            <p className="post-meta">Post #{post.id}</p>
            <p className="post-detail-caption">{post.caption}</p>
            <div className="post-detail-actions">
              <Link to={`/posts/${id}/update`} className="btn btn-primary">
                Edit
              </Link>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
