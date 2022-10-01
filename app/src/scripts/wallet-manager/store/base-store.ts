export interface StoreInterface<T> {
  getState(): Promise<T>;
  putState(newState: T): void;
  updateState(partialState: Partial<T>): void;
  clearState(): void;
}
