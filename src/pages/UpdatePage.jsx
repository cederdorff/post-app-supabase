import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PostForm from "../components/PostForm";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${URL}?id=eq.${id}`, { headers });

        if (!response.ok) {
          throw new Error("Could not load post.");
        }

        const data = await response.json();

        if (!data[0]) {
          throw new Error("Post not found.");
        }

        setPost(data[0]);
      } catch (error) {
        setErrorMessage(error.message || "Something went wrong while loading the post.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleSubmit(postData) {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${URL}?id=eq.${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error("Could not update post.");
      }

      navigate(`/posts/${id}`);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong while updating the post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <p className="status-msg">Loading post...</p>;

  return (
    <main className="app">
      <h1 className="page-title">Update Post</h1>
      {errorMessage && !post ? (
        <p className="status-banner status-banner-error">{errorMessage}</p>
      ) : (
        <PostForm
          onSubmit={handleSubmit}
          postToUpdate={post}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}
    </main>
  );
}
