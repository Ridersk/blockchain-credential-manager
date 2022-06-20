export function formatHomeUrl(url: string) {
  try {
    return new URL(url).origin;
  } catch (_) {
    return "";
  }
}
