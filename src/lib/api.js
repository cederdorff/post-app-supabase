export const POSTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/posts`;

export const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};
