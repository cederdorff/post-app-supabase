import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(`${URL}?id=eq.${id}`, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const post = data[0];

        if (!post) {
          throw new Error("Post not found");
        }

        setImage(post.image);
        setCaption(post.caption);
      } catch (caughtError) {
        console.error(caughtError);
        setError("We could not load the post. Please try again.");
      }
    }

    getPost();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${URL}?id=eq.${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          image: image.trim(),
          caption: caption.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      navigate(`/posts/${id}`);
    } catch (caughtError) {
      console.error(caughtError);
      setError("We could not update the post. Please try again.");
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Update Post</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        {error && <p className="error-message" role="alert">{error}</p>}

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              placeholder="https://..."
              value={image}
              onChange={(event) => setImage(event.target.value)}
              required
            />
            {image && (
              <img src={image} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="caption">Caption *</label>
            <textarea
              id="caption"
              name="caption"
              rows="4"
              placeholder="Write a caption for your post..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
