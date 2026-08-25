const postDateFormatter = new Intl.DateTimeFormat("da-DK", {
  dateStyle: "medium",
});

export function formatPostDate(dateString) {
  if (!dateString) return "";

  return postDateFormatter.format(new Date(dateString));
}
