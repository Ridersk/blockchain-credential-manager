import { BaseStorage } from "./baseStorage";

export class ExtensionLocalStorage extends BaseStorage {
  async setData(name: string, val: string | object): Promise<void> {
    await chrome.storage.local.set({ [name]: val });
  }

  async getData(name: string): Promise<any> {
    const data = (await chrome.storage.local.get(name))[name];
    return data;
  }

  async deleteData(name: string): Promise<void> {
    await chrome.storage.local.remove(name);
  }

  async getAllData(): Promise<any> {
    // chrome.storage.local.get(null, function (results) {
    //   console.log(results);
    // });
    return chrome.storage.local.get(null);
  }
}
