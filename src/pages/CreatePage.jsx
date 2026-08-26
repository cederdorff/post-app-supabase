import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeading from "../components/PageHeading";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function CreatePage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        image: image.trim(),
        caption: caption.trim(),
      }),
    });

    navigate("/");
  }

  return (
    <main className="app" id="main-content">
      <PageHeading title="Create Post" />
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="image">Image URL *</label>
            <input
              id="image"
              name="image"
              type="url"
              autoComplete="url"
              aria-describedby="image-help"
              placeholder="https://..."
              value={image}
              onChange={(event) => setImage(event.target.value)}
              required
            />
            <span className="form-hint" id="image-help">
              Required. Enter the full URL beginning with https://
            </span>
            {image && (
              <img
                src={image}
                alt={caption ? `Preview: ${caption}` : "Preview of the post image"}
                className="image-preview"
              />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="caption">Caption *</label>
            <textarea
              id="caption"
              name="caption"
              rows="4"
              maxLength="180"
              aria-describedby="caption-help"
              placeholder="Write a caption for your post..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              required
            />
            <span className="form-hint" id="caption-help">
              Required. Maximum 180 characters.
            </span>
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
