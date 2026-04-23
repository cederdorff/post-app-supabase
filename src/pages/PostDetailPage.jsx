import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${URL}?id=eq.${id}`, { headers });

        if (!response.ok) {
          throw new Error("Could not load post details.");
        }

        const data = await response.json();

        if (!data[0]) {
          throw new Error("Post not found.");
        }

        setPost(data[0]);
      } catch (error) {
        setErrorMessage(error.message || "Something went wrong while loading the post.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${URL}?id=eq.${id}`, { method: "DELETE", headers });

      if (!response.ok) {
        throw new Error("Could not delete post.");
      }

      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong while deleting the post.");
      setIsDeleting(false);
    }
  }

  if (isLoading) return <p className="status-msg">Loading post...</p>;

  return (
    <main className="app">
      <h1 className="page-title">Post Details</h1>
      {errorMessage && <p className="status-banner status-banner-error">{errorMessage}</p>}

      {post && (
        <article className="post-detail">
          {post.image ? <img src={post.image} alt={post.caption} /> : <div className="image-placeholder large">?</div>}
          <div className="post-detail-body">
            <p className="post-meta">Post #{post.id}</p>
            <p className="post-detail-caption">{post.caption}</p>
            <div className="post-detail-actions">
              <Link to={`/posts/${id}/update`} className="btn btn-primary">
                Edit
              </Link>
              <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
