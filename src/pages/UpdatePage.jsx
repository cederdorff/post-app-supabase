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
  const [loadedId, setLoadedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleSubmit(updatedPost) {
    await updatePost(id, updatedPost);

    navigate(`/posts/${id}`);
  }

  const currentStatus = loadedId === id ? status : "loading";
  const currentPost = loadedId === id ? post : null;

  return (
    <main className="performative-page-shell">
      <PageHero
        banner="Edit flow is loaded"
        eyebrow="Update"
        statusColor="#facc15"
        title="Update your post"
        subtitle="Review the current image and caption before saving changes."
      />

      {currentStatus === "loading" && <StatusPanel title="Loading post">Fetching the current values.</StatusPanel>}

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
        <PostForm
          key={currentPost.id}
          initialImage={currentPost.image}
          initialCaption={currentPost.caption}
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
