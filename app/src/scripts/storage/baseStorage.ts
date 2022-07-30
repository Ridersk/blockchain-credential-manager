export abstract class BaseStorage {
  abstract setData(key: string, data: any): Promise<void>;
  abstract getData(key?: string): Promise<any>;
  abstract deleteData(key: string): Promise<void>;
}
