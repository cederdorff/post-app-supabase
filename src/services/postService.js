const URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

async function request(endpoint = "", options = {}) {
  const response = await fetch(`${URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getAll() {
  return request("?order=created_at.desc");
}

export async function getById(id) {
  const posts = await request(`?id=eq.${id}`);
  return posts[0] ?? null;
}

export function create(post) {
  return request("", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

export function update(id, post) {
  return request(`?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(post),
  });
}

export function remove(id) {
  return request(`?id=eq.${id}`, { method: "DELETE" });
}
