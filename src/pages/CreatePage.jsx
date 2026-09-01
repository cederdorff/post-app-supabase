import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const POSTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/posts`;
const USERS_URL = `${import.meta.env.VITE_SUPABASE_URL}/users`;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function CreatePage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`${USERS_URL}?select=id,name,title&order=name.asc`, {
        headers
      });
      const data = await response.json();
      setUsers(data);
    }

    getUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    await fetch(POSTS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        image: image.trim(),
        caption: caption.trim(),
        userId: Number(userId)
      })
    });

    navigate("/");
  }

  return (
    <main className="app">
      <h1 className="page-title">Create Post</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="userId">User *</label>
            <select
              id="userId"
              name="userId"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}{user.title ? ` — ${user.title}` : ""}
                </option>
              ))}
            </select>
          </div>

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
