import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getById, remove } from "../services/postService";
import { formatPostDate } from "../utils/formatPostDate";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});

  useEffect(() => {
    async function getPost() {
      const post = await getById(id);
      setPost(post);
    }

    getPost();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    await remove(id);
    navigate("/");
  }

  return (
    <main className="app">
      <h1 className="page-title">Post Details</h1>
      <article className="post-detail">
        <img src={post.image} alt={post.caption} />
        <div className="post-detail-body">
          <p className="post-meta">Post #{post.id}</p>
          {post.created_at && (
            <time className="post-date" dateTime={post.created_at}>
              {formatPostDate(post.created_at)}
            </time>
          )}
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
