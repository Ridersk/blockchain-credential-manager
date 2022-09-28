import browser from "webextension-polyfill";
import { BaseStorage } from "./baseStorage";
import { LocalStorage } from "./browserLocalStorage";
import { ExtensionLocalStorage } from "./extensionLocalStorage";

export const selectedStorage: BaseStorage = browser.storage?.local
  ? new ExtensionLocalStorage()
  : new LocalStorage();
