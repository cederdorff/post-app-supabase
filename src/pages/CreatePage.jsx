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
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");

  async function handleSubmit(postData) {
    await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(postData)
    });

    navigate("/");
  }

  return (
    <main className="app">
      <h1 className="page-title">Create Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        image={image}
        caption={caption}
        onImageChange={setImage}
        onCaptionChange={setCaption}
      />
    </main>
  );
}
