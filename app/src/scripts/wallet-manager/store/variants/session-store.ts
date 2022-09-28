import browser from "webextension-polyfill";
import { StoreInterface } from "../base-store";

export class SessionStore<T> implements StoreInterface {
  private _state: T;
  private _key: string;
  private _storageMethod: chrome.storage.SessionStorageArea;

  constructor(key: string, initState: T = {} as T) {
    this._storageMethod = chrome.storage.session;
    this._key = key;
    this._state = initState;
    this.restoreState(initState);
  }

  async restoreState(initState: T) {
    let state: T = await this.getState();
    if (!state) {
      this.putState(initState);
      state = initState;
    }
    this._state = state;
  }

  async getState(): Promise<T> {
    return (await this._storageMethod.get(this._key))[this._key];
  }

  async putState(newState: T) {
    this._state = newState;
    await this._storageMethod.set({ [this._key]: this._state });
  }

  async updateState(partialState: Partial<T>) {
    this._state = { ...this._state, ...partialState };
    await this._storageMethod.set({ [this._key]: this._state });
  }

  async clearState() {
    await this._storageMethod.clear();
  }
}
