// interface MemoryStoreInterface<T> {
//   getState(): any;
//   putState(newState: T): void;
//   updateState(partialState: T): void;
// }

interface MemoryStoreInterface {
  getState(): any;
  putState(newState: any): void;
  updateState(partialState: any): void;
}

export class MemoryStore<T> implements MemoryStoreInterface {
  private _state: T;

  constructor(initState: T = {} as T) {
    this._state = initState;
  }

  getState() {
    return this._state;
  }

  putState(newState: T) {
    this._state = newState;
  }

  updateState(partialState: Partial<T>) {
    this._state = { ...this._state, ...partialState };
  }
}

type ComposableMemoryStoreOpts = {
  stores: { [key: string]: MemoryStoreInterface };
};

export class ComposableMemoryStore<T extends MemoryStoreInterface = MemoryStoreInterface> {
  private _stores: { [key: string]: MemoryStore<T> } = {};

  constructor(opts: ComposableMemoryStoreOpts) {
    this._stores = opts.stores as { [key: string]: MemoryStore<T> };
  }

  getState() {
    const state: { [k: string]: object } = {};
    for (const key in this._stores) {
      state[key] = this._stores[key].getState();
    }
    return state;
  }
}
