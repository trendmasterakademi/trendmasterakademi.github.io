export function formatDocumentTitle(title) {
  if (!title || title.length <= 60) {
    return title;
  }
  const brandSuffixes = [' | Trend Master Akademi', ' | Trend Master Academy'];
  for (const suffix of brandSuffixes) {
    if (title.endsWith(suffix)) {
      return title.slice(0, -suffix.length);
    }
  }
  return title;
}
