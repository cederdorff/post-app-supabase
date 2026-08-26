export function formatPostDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("da-DK", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return formattedDate;
}
