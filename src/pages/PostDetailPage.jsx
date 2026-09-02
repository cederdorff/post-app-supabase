import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const POSTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/posts`;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});

  useEffect(() => {
    async function getPost() {
      const query = `?id=eq.${id}&select=id,caption,image,user:users(id,name,title,image)`;
      const response = await fetch(`${POSTS_URL}${query}`, { headers });
      const data = await response.json();
      setPost(data[0]);
    }

    getPost();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    await fetch(`${POSTS_URL}?id=eq.${id}`, {
      method: "DELETE",
      headers
    });
    navigate("/");
  }

  return (
    <main className="app">
      <h1 className="page-title">Post Details</h1>
      <article className="post-detail">
        {post.user && (
          <div className="post-author">
            <img src={post.user.image} alt="" />
            <div>
              <p>{post.user.name}</p>
              <p>{post.user.title}</p>
            </div>
          </div>
        )}
        <img className="post-image" src={post.image} alt={post.caption} />
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
    </main>
  );
}
