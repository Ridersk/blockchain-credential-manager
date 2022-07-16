export class MemoryStore<T> {
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
