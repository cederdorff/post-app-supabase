import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import PageHeading from "../components/PageHeading";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function getPost() {
      const response = await fetch(`${URL}?id=eq.${id}`, { headers });
      const data = await response.json();
      setPost(data[0]);
    }

    getPost();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    await fetch(`${URL}?id=eq.${id}`, { method: "DELETE", headers });
    navigate("/");
  }

  return (
    <main className="app" id="main-content">
      <PageHeading>Post Details</PageHeading>
      {!post ? (
        <p className="status-message" role="status">
          Loading post…
        </p>
      ) : (
        <article className="post-detail">
          <img src={post.image} alt={post.alt_text || post.caption} />
          <div className="post-detail-body">
            <p className="post-meta">Post #{post.id}</p>
            <p className="post-detail-caption">{post.caption}</p>
            <div className="post-detail-actions">
              <Link to={`/posts/${id}/update`} className="btn btn-primary">
                Edit
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
