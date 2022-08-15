export function extractURLOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch (_) {
    return "";
  }
}
