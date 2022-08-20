export function extractURLOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch (_) {
    return "";
  }
}

export function extractURLHashSearchParams(url: string) {
  try {
    const urlInstance = new URL(url);
    const urlHash = urlInstance.hash;
    return new URLSearchParams(urlHash.slice(urlHash.indexOf("?") + 1));
  } catch (_) {
    return new URLSearchParams();
  }
}
