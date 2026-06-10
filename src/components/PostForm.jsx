import { useState } from "react";
import { Link } from "react-router";
import { Button, GlassCard } from "performative-ui";

export default function PostForm({
  initialImage = "",
  initialCaption = "",
  submitLabel,
  cancelLabel,
  cancelTo,
  onSubmit
}) {
  const [image, setImage] = useState(initialImage);
  const [caption, setCaption] = useState(initialCaption);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedImage = image.trim();
    const trimmedCaption = caption.trim();

    if (!trimmedImage || !trimmedCaption) {
      setFormError("Both image URL and caption are required.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await onSubmit({ image: trimmedImage, caption: trimmedCaption });
    } catch (error) {
      setFormError(error.message || "The post could not be saved.");
      setIsSubmitting(false);
    }
  }

  function handleImageChange(event) {
    setImage(event.target.value);
    setPreviewFailed(false);
  }

  const hasPreview = image.trim().length > 0 && !previewFailed;
  const previewCaption = caption.trim() || "Your caption will appear here.";

  return (
    <GlassCard className="post-form-card" breathing>
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="post-form-layout">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                placeholder="https://..."
                value={image}
                onChange={handleImageChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="caption">Caption</label>
              <textarea
                id="caption"
                name="caption"
                rows="6"
                placeholder="Write a caption for your post..."
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                required
              />
            </div>
          </div>

          <aside className="post-preview" aria-label="Post preview">
            <div className={`image-preview-frame ${hasPreview ? "" : "image-preview-frame-empty"}`}>
              {hasPreview ? (
                <img
                  src={image}
                  alt="Post preview"
                  className="image-preview"
                  onError={() => setPreviewFailed(true)}
                />
              ) : (
                <p>{previewFailed ? "Image could not be loaded." : "Image preview"}</p>
              )}
            </div>

            <div className="post-preview-body">
              <p className="post-card-id">Preview</p>
              <strong>{previewCaption}</strong>
            </div>
          </aside>
        </div>

        {formError && (
          <p className="form-message" role="alert">
            {formError}
          </p>
        )}

        <div className="form-actions">
          <Button type="submit" variant="glow" sparkle loading={isSubmitting}>
            {submitLabel}
          </Button>
          <Button as={Link} to={cancelTo} variant="ghost">
            {cancelLabel}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
