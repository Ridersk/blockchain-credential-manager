import { StoreInterface } from "./base-store";

export class MemoryStore<T> implements StoreInterface {
  private _state: T;
  private _key: string;
  storageMethod: chrome.storage.SessionStorageArea;

  constructor(key: string, initState: T = {} as T) {
    this.storageMethod = chrome.storage.session;
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
    return (await this.storageMethod.get(this._key))[this._key];
  }

  async putState(newState: T) {
    this._state = newState;
    await this.storageMethod.set({ [this._key]: this._state });
  }

  async updateState(partialState: Partial<T>) {
    this._state = { ...this._state, ...partialState };
    await this.storageMethod.set({ [this._key]: this._state });
  }

  async clearState() {
    await this.storageMethod.clear();
  }
}
