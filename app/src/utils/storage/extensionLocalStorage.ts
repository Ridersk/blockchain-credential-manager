import { BaseStorage } from "./baseStorage";

export class ExtensionLocalStorage extends BaseStorage {
  constructor() {
    console.log("Storage = Local");
    super();
  }

  async setData(name: string, val: string | object): Promise<void> {
    await chrome.storage.local.set({ [name]: val });
  }

  async getData(name: string, tryConvert?: boolean): Promise<string | object | null | undefined> {
    const data = (await chrome.storage.local.get(name))[name];

    try {
      if (!tryConvert) throw Error();
      return JSON.parse(data);
    } catch (err) {
      return data;
    }
  }

  async deleteData(name: string): Promise<void> {
    await chrome.storage.local.remove(name);
  }

  async getAllData(): Promise<string | object | null | undefined> {
    // chrome.storage.local.get(null, function (results) {
    //   console.log(results);
    // });
    return chrome.storage.local.get(null);
  }
}
