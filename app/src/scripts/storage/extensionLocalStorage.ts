import { BaseStorage } from "./baseStorage";

export class ExtensionLocalStorage extends BaseStorage {
  async setData(key: string, val: any): Promise<void> {
    await chrome.storage.local.set({ [key]: val });
  }

  async getData(key?: string): Promise<any> {
    const data = await chrome.storage.local.get(key);
    return key ? data[key] : data;
  }

  async deleteData(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }

  async getAllData(): Promise<any> {
    return chrome.storage.local.get(null);
  }
}
