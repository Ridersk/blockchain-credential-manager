import { StoreInterface } from "./base-store";
import { MemoryStore } from "./memory-store";

type ComposableStoreOpts = {
  stores: { [key: string]: StoreInterface };
};

export class ComposableStore<T extends StoreInterface = StoreInterface> {
  private _stores: { [key: string]: MemoryStore<T> } = {};

  constructor(opts: ComposableStoreOpts) {
    this._stores = opts.stores as { [key: string]: MemoryStore<T> };
  }

  async getState() {
    const state: { [k: string]: object } = {};
    for (const key in this._stores) {
      state[key] = await this._stores[key].getState();
    }
    return state;
  }
}
