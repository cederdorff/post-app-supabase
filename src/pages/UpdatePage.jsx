import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { Button } from "performative-ui";
import PageHero from "../components/PageHero";
import PostForm from "../components/PostForm";
import StatusPanel from "../components/StatusPanel";
import { getPost, updatePost } from "../lib/postsApi";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleSubmit(updatedPost) {
    await updatePost(id, updatedPost);

    navigate(`/posts/${id}`);
  }

  return (
    <main className="performative-page-shell">
      <PageHero
        banner="Edit flow is loaded"
        eyebrow="Update"
        statusColor="#facc15"
        title="Update your post"
        subtitle="Review the current image and caption before saving changes."
      />

      {status === "loading" && <StatusPanel title="Loading post">Fetching the current values.</StatusPanel>}

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
        <PostForm
          initialImage={post.image}
          initialCaption={post.caption}
          submitLabel="Save Changes"
          cancelLabel="Back to Details"
          cancelTo={`/posts/${id}`}
          onSubmit={handleSubmit}
        />
      )}

      <div className="page-back-row">
        <Button as={Link} to="/" variant="ghost" size="sm">
          Back to Feed
        </Button>
      </div>
    </main>
  );
}
