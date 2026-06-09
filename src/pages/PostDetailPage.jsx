import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, GlassCard, StatusDot } from "performative-ui";
import PageHero from "../components/PageHero";
import StatusPanel from "../components/StatusPanel";
import { deletePost, getPost } from "../lib/postsApi";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPost = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await getPost(id);

      if (!data) {
        setStatus("not-found");
        return;
      }

      setPost(data);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message || "The post could not be loaded.");
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    setDeleteError("");
    setIsDeleting(true);

    try {
      await deletePost(id);
      navigate("/");
    } catch (error) {
      setDeleteError(error.message || "The post could not be deleted.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="performative-page-shell">
      <PageHero
        ambient={false}
        banner="Single post mission control"
        eyebrow={
          <>
            <StatusDot /> Live record
          </>
        }
        title="Post Details"
        subtitle="Inspect the record, make edits, or delete it from Supabase."
      />

      {status === "loading" && <StatusPanel title="Loading post">Fetching the selected record.</StatusPanel>}

      {status === "error" && (
        <StatusPanel tone="danger" title="Could not load post" actionLabel="Try again" onAction={loadPost}>
          {errorMessage}
        </StatusPanel>
      )}

      {status === "not-found" && (
        <StatusPanel tone="warning" title="Post not found" actionLabel="Back to feed" actionTo="/">
          There is no post with id {id}.
        </StatusPanel>
      )}

      {status === "success" && post && (
        <GlassCard className="post-detail" breathing>
          {post.image ? (
            <img src={post.image} alt={post.caption || "Post image"} />
          ) : (
            <div className="post-detail-placeholder">No image</div>
          )}

          <div className="post-detail-body">
            <p className="post-meta">Post #{post.id}</p>
            <p className="post-detail-caption">{post.caption}</p>

            {deleteError && (
              <p className="form-message" role="alert">
                {deleteError}
              </p>
            )}

            <div className="post-detail-actions">
              <Button as={Link} to={`/posts/${id}/update`} variant="glow" sparkle>
                Edit Post
              </Button>
              <Button variant="ghost" onClick={handleDelete} loading={isDeleting}>
                Delete Post
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </main>
  );
}
