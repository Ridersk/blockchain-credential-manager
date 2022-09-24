import { StoreInterface } from "./base-store";
import { SessionStore } from "./variants/session-store";

type ComposableStoreOpts = {
  stores: { [key: string]: StoreInterface };
};

export class ComposableStore<T extends StoreInterface = StoreInterface> {
  private _stores: { [key: string]: SessionStore<T> } = {};

  constructor(opts: ComposableStoreOpts) {
    this._stores = opts.stores as { [key: string]: SessionStore<T> };
  }

  async getState() {
    const state: { [k: string]: object } = {};
    for (const key in this._stores) {
      state[key] = await this._stores[key].getState();
    }
    return state;
  }
}
