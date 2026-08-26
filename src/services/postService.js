const URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export async function getAll() {
  const response = await fetch(`${URL}?order=created_at.desc`, { headers });

  return response.json();
}

export async function getById(id) {
  const response = await fetch(`${URL}?id=eq.${id}`, { headers });

  const posts = await response.json();
  return posts[0] ?? null;
}

export async function create(post) {
  await fetch(URL, {
    headers,
    method: "POST",
    body: JSON.stringify(post),
  });
}

export async function update(id, post) {
  await fetch(`${URL}?id=eq.${id}`, {
    headers,
    method: "PATCH",
    body: JSON.stringify(post),
  });
}

export async function remove(id) {
  await fetch(`${URL}?id=eq.${id}`, {
    headers,
    method: "DELETE",
  });
}
