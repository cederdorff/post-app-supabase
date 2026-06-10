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
  const [loadedId, setLoadedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState("");

  const loadPost = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await getPost(id);

      if (!data) {
        setPost(null);
        setLoadedId(id);
        setStatus("not-found");
        return;
      }

      setPost(data);
      setLoadedId(id);
      setStatus("success");
    } catch (error) {
      setPost(null);
      setLoadedId(id);
      setErrorMessage(error.message || "The post could not be loaded.");
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    let ignore = false;

    async function loadInitialPost() {
      try {
        const data = await getPost(id);

        if (ignore) return;

        if (!data) {
          setPost(null);
          setLoadedId(id);
          setStatus("not-found");
          return;
        }

        setPost(data);
        setLoadedId(id);
        setErrorMessage("");
        setStatus("success");
      } catch (error) {
        if (ignore) return;

        setPost(null);
        setLoadedId(id);
        setErrorMessage(error.message || "The post could not be loaded.");
        setStatus("error");
      }
    }

    loadInitialPost();

    return () => {
      ignore = true;
    };
  }, [id]);

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

  const currentStatus = loadedId === id ? status : "loading";
  const currentPost = loadedId === id ? post : null;
  const imageUrl = currentPost?.image?.trim();
  const showImage = imageUrl && failedImageUrl !== imageUrl;

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

      {currentStatus === "loading" && <StatusPanel title="Loading post">Fetching the selected record.</StatusPanel>}

      {currentStatus === "error" && (
        <StatusPanel tone="danger" title="Could not load post" actionLabel="Try again" onAction={loadPost}>
          {errorMessage}
        </StatusPanel>
      )}

      {currentStatus === "not-found" && (
        <StatusPanel tone="warning" title="Post not found" actionLabel="Back to feed" actionTo="/">
          There is no post with id {id}.
        </StatusPanel>
      )}

      {currentStatus === "success" && currentPost && (
        <GlassCard className="post-detail" breathing>
          {showImage ? (
            <img
              src={imageUrl}
              alt={currentPost.caption || "Post image"}
              onError={() => setFailedImageUrl(imageUrl)}
            />
          ) : (
            <div className="post-detail-placeholder">No image</div>
          )}

          <div className="post-detail-body">
            <p className="post-meta">Post #{currentPost.id}</p>
            <p className="post-detail-caption">{currentPost.caption}</p>

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
