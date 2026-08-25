const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

async function getPost(id) {
  const response = await fetch(`${URL}?id=eq.${id}`, { headers });
  const data = await response.json();
  console.log(data);
  const post = data[0];
  return post;
}

getPost(5);
