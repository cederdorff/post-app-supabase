import { useState } from "react";
import { useNavigate } from "react-router";
import PostForm from "../components/PostForm";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function CreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(postData) {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error("Could not create post.");
      }

      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong while creating the post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Create Post</h1>
      <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
    </main>
  );
}
