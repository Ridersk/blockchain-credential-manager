import { StoreInterface } from "./base-store";

type ComposableStoreOpts = {
  stores: { [key: string]: StoreInterface<any> };
};

export class ComposableStore<T extends StoreInterface<T> = StoreInterface<any>> {
  private _stores: { [key: string]: StoreInterface<T> } = {};

  constructor(opts: ComposableStoreOpts) {
    this._stores = opts.stores as { [key: string]: StoreInterface<T> };
  }

  async getState() {
    const state: { [k: string]: object } = {};
    for (const key in this._stores) {
      state[key] = await this._stores[key].getState();
    }
    return state;
  }
}
