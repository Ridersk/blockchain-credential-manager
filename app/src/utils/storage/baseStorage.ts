export abstract class BaseStorage {
  abstract setData(key: string, data: string | object): Promise<void>;
  abstract getData(key: string): Promise<any>;
  abstract deleteData(key: string): Promise<void>;
}
