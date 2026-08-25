import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPost() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${URL}?id=eq.${id}`, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const loadedPost = data[0];

        if (!loadedPost) {
          throw new Error("Post not found");
        }

        setPost(loadedPost);
      } catch (caughtError) {
        console.error(caughtError);
        setError("We could not load the post. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    getPost();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${URL}?id=eq.${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          image: post.image.trim(),
          caption: post.caption.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      navigate(`/posts/${id}`);
    } catch (caughtError) {
      console.error(caughtError);
      setError("We could not update the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Update Post</h1>

      {loading && <p className="status-message">Loading post...</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {!loading && post && (
        <form className="post-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                placeholder="https://..."
                value={post.image}
                onChange={(event) => setPost({ ...post, image: event.target.value })}
                required
              />
              {post.image && <img src={post.image} alt="Preview" className="image-preview" />}
            </div>

            <div className="form-field">
              <label htmlFor="caption">Caption *</label>
              <textarea
                id="caption"
                name="caption"
                rows="4"
                placeholder="Write a caption for your post..."
                value={post.caption}
                onChange={(event) => setPost({ ...post, caption: event.target.value })}
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
      )}
    </main>
  );
}
