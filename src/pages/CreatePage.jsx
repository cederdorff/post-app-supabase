import { useState } from "react";
import { useNavigate } from "react-router";
import PostForm from "../components/PostForm";
import { create } from "../services/postService";

export default function CreatePage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");

  async function handleCreate(event) {
    event.preventDefault();

    await create({
      image: image.trim(),
      caption: caption.trim(),
    });

    navigate("/");
  }

  return (
    <main className="app">
      <h1 className="page-title">Create Post</h1>
      <PostForm
        image={image}
        caption={caption}
        onImageChange={setImage}
        onCaptionChange={setCaption}
        onSubmit={handleCreate}
        submitLabel="Create post"
      />
    </main>
  );
}
