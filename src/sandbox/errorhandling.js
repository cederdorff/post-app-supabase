const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

async function getPost(id) {
  const response = await fetch(`${URL}?id=eq.${id}`, { headers });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  const post = data[0];

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

try {
  const post = await getPost(5);
  console.log(post);
} catch (caughtError) {
  console.error(caughtError.message);
}
