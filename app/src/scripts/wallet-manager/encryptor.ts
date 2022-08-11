export interface EncryptorInterface {
  encrypt(password: string, dataObj: object): Promise<string>;
  decrypt(password: string, text: string): Promise<any>;
}
