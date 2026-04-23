import { useNavigate } from "react-router";

export default function PostForm({ onSubmit, image, caption, onImageChange, onCaptionChange }) {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      image: image.trim(),
      caption: caption.trim()
    });
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
            onChange={(event) => onImageChange(event.target.value)}
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
            onChange={(event) => onCaptionChange(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
