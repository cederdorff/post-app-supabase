const URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

const baseOptions = { headers };

export async function getAll() {
  const response = await fetch(`${URL}?order=created_at.desc`, baseOptions);

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return response.json();
}

export async function getById(id) {
  const response = await fetch(`${URL}?id=eq.${id}`, baseOptions);

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  const posts = await response.json();
  return posts[0] ?? null;
}

export async function create(post) {
  const response = await fetch(URL, {
    ...baseOptions,
    method: "POST",
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }
}

export async function update(id, post) {
  const response = await fetch(`${URL}?id=eq.${id}`, {
    ...baseOptions,
    method: "PATCH",
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }
}

export async function remove(id) {
  const response = await fetch(`${URL}?id=eq.${id}`, {
    ...baseOptions,
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }
}
