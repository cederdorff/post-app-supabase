import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PostForm from "../components/PostForm";
import { getById, update } from "../services/postService";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    async function getPost() {
      const post = await getById(id);
      setImage(post.image);
      setCaption(post.caption);
    }

    getPost();
  }, [id]);

  async function handleUpdate(event) {
    event.preventDefault();

    await update(id, {
      image: image.trim(),
      caption: caption.trim(),
    });

    navigate(`/posts/${id}`);
  }

  return (
    <main className="app">
      <h1 className="page-title">Update Post</h1>

      <PostForm
        image={image}
        caption={caption}
        onImageChange={setImage}
        onCaptionChange={setCaption}
        onSubmit={handleUpdate}
        submitLabel="Update post"
      />
    </main>
  );
}
