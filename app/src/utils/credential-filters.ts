import { Credential } from "models/Credential";

export const filterCredentialsByText = (credentials: Array<Credential>, text: string) => {
  if (text) {
    const searchText = text.toLowerCase();
    return credentials?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchText) ||
        item.url.toLowerCase().includes(searchText) ||
        item.label.toLowerCase().includes(searchText)
    );
  }
  return credentials;
};

export const filterCredentialsByURL = (credentials: Array<Credential>, url: string) => {
  if (url) {
    return credentials?.filter((item) => item.url === url);
  }
  return [];
};
