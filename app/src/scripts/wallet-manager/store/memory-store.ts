import { StoreInterface } from "./base-store";

export class MemoryStore<T> implements StoreInterface {
  private _state: T;
  private _key: string;

  constructor(key: string, initState: T = {} as T) {
    this._key = key;
    this._state = initState;
    this.putState(initState);
  }

  async getState(): Promise<T> {
    return (await chrome.storage.session.get(this._key))[this._key];
  }

  async putState(newState: T) {
    this._state = newState;
    await chrome.storage.session.set({ [this._key]: this._state });
  }

  async updateState(partialState: Partial<T>) {
    this._state = { ...this._state, ...partialState };
    await chrome.storage.session.set({ [this._key]: this._state });
  }
}
