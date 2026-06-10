import { useState } from "react";
import { Link } from "react-router";
import { GlassCard } from "performative-ui";

export default function PostCard({ post }) {
  const caption = post.caption || "Untitled post";
  const imageUrl = post.image?.trim();
  const [failedImageUrl, setFailedImageUrl] = useState("");
  const showImage = imageUrl && failedImageUrl !== imageUrl;

  return (
    <Link to={`/posts/${post.id}`} className="post-card-link">
      <GlassCard className="post-card" breathing glowOnHover>
        {showImage ? (
          <img src={imageUrl} alt={caption} onError={() => setFailedImageUrl(imageUrl)} />
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
