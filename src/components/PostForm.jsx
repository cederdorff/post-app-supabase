import { useState } from "react";
import { useNavigate } from "react-router";

export default function PostForm({ onSubmit, postToUpdate, isSubmitting = false, errorMessage = "" }) {
  const [image, setImage] = useState(postToUpdate?.image || "");
  const [caption, setCaption] = useState(postToUpdate?.caption || "");
  const [captionError, setCaptionError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedCaption = caption.trim();
    const trimmedImage = image.trim();

    if (!trimmedCaption) {
      setCaptionError("Caption is required.");
      return;
    }

    setCaptionError("");
    await onSubmit({ image: trimmedImage, caption: trimmedCaption });
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
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
            onChange={(e) => {
              setCaption(e.target.value);
              setCaptionError("");
            }}
            required
            className={captionError ? "input-error" : ""}
            aria-invalid={Boolean(captionError)}
          />
          {captionError && <p className="form-message form-message-error">{captionError}</p>}
        </div>
      </div>
      {errorMessage && <p className="form-message form-message-error">{errorMessage}</p>}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : postToUpdate ? "Update post" : "Create post"}
        </button>
      </div>
    </form>
  );
}
