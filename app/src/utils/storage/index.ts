import { BaseStorage } from "./baseStorage";
import { LocalStorage } from "./browserLocalStorage";
import { ExtensionLocalStorage } from "./extensionLocalStorage";

const selectedStorage: BaseStorage = chrome.storage?.local
  ? new ExtensionLocalStorage()
  : new LocalStorage();

export default selectedStorage;
