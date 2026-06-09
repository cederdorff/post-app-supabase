const POSTS_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_APIKEY;

function assertSupabaseConfig() {
  if (!POSTS_URL || !SUPABASE_KEY) {
    throw new Error("Supabase URL or API key is missing. Check your .env file.");
  }
}

function postsUrl() {
  assertSupabaseConfig();
  return new URL(POSTS_URL);
}

async function request(url, options = {}) {
  assertSupabaseConfig();

  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function listPosts() {
  const url = postsUrl();
  url.searchParams.set("order", "id.desc");

  const data = await request(url);
  return Array.isArray(data) ? data : [];
}

export async function getPost(id) {
  const url = postsUrl();
  url.searchParams.set("id", `eq.${id}`);

  const data = await request(url);
  return Array.isArray(data) ? data[0] ?? null : null;
}

export function createPost(post) {
  return request(postsUrl(), {
    method: "POST",
    body: JSON.stringify(post)
  });
}

export function updatePost(id, post) {
  const url = postsUrl();
  url.searchParams.set("id", `eq.${id}`);

  return request(url, {
    method: "PATCH",
    body: JSON.stringify(post)
  });
}

export function deletePost(id) {
  const url = postsUrl();
  url.searchParams.set("id", `eq.${id}`);

  return request(url, { method: "DELETE" });
}
