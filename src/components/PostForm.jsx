export default function PostForm({
  image,
  caption,
  onImageChange,
  onCaptionChange,
  onSubmit,
  submitLabel = "Save",
}) {
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            placeholder="https://..."
            value={image}
            onChange={(event) => onImageChange(event.target.value)}
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
            onChange={(event) => onCaptionChange(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
