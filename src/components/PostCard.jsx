import { Link } from "react-router";
import { formatPostDate } from "../utils/formatPostDate";

export default function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <img src={post.image} alt={post.caption} />
      <div className="post-card-body">
        <p className="post-card-id">Post #{post.id}</p>
        {post.created_at && (
          <time className="post-date" dateTime={post.created_at}>
            {formatPostDate(post.created_at)}
          </time>
        )}
        <h2>{post.caption}</h2>
      </div>
    </Link>
  );
}
