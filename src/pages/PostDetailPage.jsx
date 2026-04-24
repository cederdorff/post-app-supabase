import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { URL, headers } from "../lib/api";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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

        setPost(currentPost);
      } catch (error) {
        console.error(error);
        setErrorMessage("Kunne ikke hente post.");
      } finally {
        setIsLoading(false);
      }
    }

    getPost();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${URL}?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Kunne ikke slette post.");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Kunne ikke slette post.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="app">
      <h1 className="page-title">Post Details</h1>
      {isLoading && <p className="status-message">Loading post...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {post && !isLoading && !errorMessage && (
        <article className="post-detail">
          <img src={post.image} alt={post.caption} />
          <div className="post-detail-body">
            <p className="post-meta">Post #{post.id}</p>
            <p className="post-detail-caption">{post.caption}</p>
            <div className="post-detail-actions">
              <Link
                to={`/posts/${id}/update`}
                className="btn btn-primary"
                aria-disabled={isDeleting}
                onClick={(event) => {
                  if (isDeleting) {
                    event.preventDefault();
                  }
                }}
              >
                Edit
              </Link>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
