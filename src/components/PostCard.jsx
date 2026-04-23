import { Link } from "react-router";

export default function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      {post.image ? <img src={post.image} alt={post.caption} /> : <div className="image-placeholder">?</div>}
      <div className="post-card-body">
        <p className="post-card-id">Post #{post.id}</p>
        <h2>{post.caption || "No caption yet."}</h2>
      </div>
    </Link>
  );
}
