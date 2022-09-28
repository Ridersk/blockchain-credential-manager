import browser from "webextension-polyfill";
import { BaseStorage } from "./baseStorage";

export class ExtensionLocalStorage extends BaseStorage {
  storageMethod: browser.Storage.LocalStorageArea;

  constructor() {
    super();
    this.storageMethod = browser.storage.local;
  }

  async setData(key: string, val: any): Promise<void> {
    await this.storageMethod.set({ [key]: val });
  }

  async getData(key?: string): Promise<any> {
    const data = await this.storageMethod.get(key);
    return key ? data[key] : data;
  }

  async deleteData(key: string): Promise<void> {
    await this.storageMethod.remove(key);
  }

  async getAllData(): Promise<any> {
    return this.storageMethod.get(null);
  }

  async clearData(): Promise<void> {
    await this.storageMethod.clear();
  }
}
