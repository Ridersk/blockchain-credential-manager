import { object } from "yup";
import { BaseStorage } from "./baseStorage";

export class CookieStorage extends BaseStorage {
  defaultExpirationTimeDelta: number = 7 * 24 * 60 * 60 * 1000;

  constructor() {
    console.log("Storage = Cookies");
    super();
  }

  async setData(key: string, val: string | object): Promise<void> {
    const date = new Date();
    const value = typeof val == "object" ? JSON.stringify(object) : val;

    date.setTime(date.getTime() + this.defaultExpirationTimeDelta);
    document.cookie = key + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
  }

  async getData(key: string, tryConvert?: boolean): Promise<string | object | null | undefined> {
    const data = "; " + document.cookie;
    const parts = data.split("; " + key + "=");

    if (parts.length == 2) {
      const cookieData = parts.pop()?.split(";").shift();

      try {
        if (!tryConvert) throw Error();
        return JSON.parse(cookieData as string);
      } catch (err) {
        return cookieData;
      }
    }
    return null;
  }

  async deleteData(key: string): Promise<void> {
    const date = new Date();
    // Set it expire in -1 days
    const pastTimeExpiration = -1 * 24 * 60 * 60 * 1000;

    date.setTime(date.getTime() + pastTimeExpiration);
    document.cookie = key + "=; expires=" + date.toUTCString() + "; path=/";
  }
}
