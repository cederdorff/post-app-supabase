import { useNavigate, useSearchParams } from "react-router";
import PageHero from "../components/PageHero";
import PostForm from "../components/PostForm";
import { createPost } from "../lib/postsApi";

export default function CreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledCaption = searchParams.get("caption") ?? "";

  async function handleSubmit(post) {
    await createPost(post);
    navigate("/");
  }

  return (
    <main className="performative-page-shell">
      <PageHero
        banner="Create flow is ready"
        eyebrow="Create"
        statusColor="#38bdf8"
        title="Compose your next post"
        subtitle="Add an image URL and a caption. The preview updates before you save."
      />

      <PostForm
        initialCaption={prefilledCaption}
        submitLabel="Save Post"
        cancelLabel="Cancel"
        cancelTo="/"
        onSubmit={handleSubmit}
      />
    </main>
  );
}
