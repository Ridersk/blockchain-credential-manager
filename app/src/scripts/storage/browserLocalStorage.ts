import { BaseStorage } from "./baseStorage";

export class LocalStorage extends BaseStorage {
  defaultExpirationTimeDelta: number = 7 * 24 * 60 * 60 * 1000;

  async setData(key: string, val: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(val));
  }

  async getData(key?: string): Promise<any> {
    try {
      return JSON.parse(localStorage.getItem(key || "") as string);
    } catch (error) {
      return null;
    }
  }

  async deleteData(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clearData(): Promise<void> {
    localStorage.clear();
  }
}
