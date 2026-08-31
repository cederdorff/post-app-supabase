import { Link } from "react-router";

export default function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <div className="post-author">
        <img src={post.userImage} alt="" />
        <div>
          <p>{post.userName}</p>
          <p>{post.userTitle}</p>
        </div>
      </div>
      <img className="post-image" src={post.image} alt={post.caption} />
      <div className="post-card-body">
        <p className="post-card-id">Post #{post.id}</p>
        <h2>{post.caption}</h2>
      </div>
    </Link>
  );
}
