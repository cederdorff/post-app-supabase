import { Link } from "react-router";
import { GlassCard } from "performative-ui";

export default function PostCard({ post }) {
  const caption = post.caption || "Untitled post";

  return (
    <Link to={`/posts/${post.id}`} className="post-card-link">
      <GlassCard className="post-card" breathing glowOnHover>
        {post.image ? (
          <img src={post.image} alt={caption} />
        ) : (
          <div className="post-card-placeholder">No image</div>
        )}
        <div className="post-card-body">
          <p className="post-card-id">Post #{post.id}</p>
          <GlassCard.Title>{caption}</GlassCard.Title>
        </div>
      </GlassCard>
    </Link>
  );
}
