import { selectedStorage } from "./local-storage";
import { StoreInterface } from "../../base-store";

export class PersistentStore<T> implements StoreInterface {
  private _state: T;
  private _key: string;

  constructor(key: string, initState: T = {} as T) {
    this._key = key;
    this._state = initState;
    this.putState(initState);
  }

  async getState() {
    return this._state || selectedStorage.getData(this._key);
  }

  async putState(newState: T) {
    this._state = newState;
    await selectedStorage.setData(this._key, this._state);
  }

  async updateState(partialState: Partial<T>) {
    this._state = { ...this._state, ...partialState };
    await selectedStorage.setData(this._key, this._state);
  }

  async clearState() {
    await selectedStorage.clearData();
  }
}
