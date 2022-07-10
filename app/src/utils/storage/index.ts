import { BaseStorage } from "./baseStorage";
import { CookieStorage } from "./cookieStorage";
import { ExtensionLocalStorage } from "./extensionLocalStorage";

const extensionStorage: BaseStorage = chrome.storage?.local
  ? new ExtensionLocalStorage()
  : new CookieStorage();

export default extensionStorage;
