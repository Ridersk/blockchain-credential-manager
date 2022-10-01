import { StoreInterface } from "../base-store";

export class MemoryStore<T> implements StoreInterface<T> {
  private _state: T;

  constructor(_key: string, initState: T = {} as T) {
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
    return this._state;
  }

  async putState(newState: T) {
    this._state = newState;
  }

  async updateState(partialState: Partial<T>) {
    this._state = { ...this._state, ...partialState };
  }

  async clearState() {
    this._state = {} as T;
  }
}
