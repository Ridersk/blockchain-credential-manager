export interface StoreInterface {
  getState(): any;
  putState(newState: any): void;
  updateState(partialState: any): void;
}
