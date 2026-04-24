import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { URL, headers } from "../lib/api";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getPost() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${URL}?id=eq.${id}`, { headers });

        if (!response.ok) {
          throw new Error("Kunne ikke hente post.");
        }

        const data = await response.json();
        const currentPost = data[0];

        if (!currentPost) {
          throw new Error("Posten blev ikke fundet.");
        }

        setImage(currentPost.image);
        setCaption(currentPost.caption);
      } catch (error) {
        console.error(error);
        setErrorMessage("Kunne ikke hente post.");
      } finally {
        setIsLoading(false);
      }
    }

    getPost();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

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
        throw new Error("Kunne ikke opdatere post.");
      }

      navigate(`/posts/${id}`);
    } catch (error) {
      console.error(error);
      setErrorMessage("Kunne ikke opdatere post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Update Post</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        {isLoading && <p className="status-message">Loading post...</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              placeholder="https://..."
              value={image}
              onChange={(event) => setImage(event.target.value)}
              disabled={isLoading || isSubmitting}
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
              disabled={isLoading || isSubmitting}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
