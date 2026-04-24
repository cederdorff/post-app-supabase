import { useState } from "react";
import { useNavigate } from "react-router";
import { URL, headers } from "../lib/api";

export default function CreatePage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          image: image.trim(),
          caption: caption.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke gemme post.");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Kunne ikke gemme post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Create Post</h1>
      <form className="post-form" onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
              required
            />
            {image && <img src={image} alt="Preview" className="image-preview" />}
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
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
