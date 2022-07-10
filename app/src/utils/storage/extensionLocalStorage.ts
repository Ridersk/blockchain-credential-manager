import { BaseStorage } from "./baseStorage";

export class ExtensionLocalStorage extends BaseStorage {
  constructor() {
    console.log("Storage = Local");
    super();
  }

  async setData(name: string, val: string | object): Promise<void> {
    await chrome.storage.local.set({ [name]: val });
  }

  async getData(name: string): Promise<string | object | null | undefined> {
    // let data = null;
    // chrome.storage.local.get(name, function (response) {
    //   data = response[name];
    // });

    const response = await chrome.storage.local.get(name);
    return response[name];
  }

  async deleteData(name: string): Promise<void> {
    await chrome.storage.local.remove(name);
  }
}
