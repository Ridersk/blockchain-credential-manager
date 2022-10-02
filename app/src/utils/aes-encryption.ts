import Logger from "./log";

export class EncryptionUtils {
  passwordSalt: string;
  encryptionIv: string;

  constructor(passwordSalt?: string, encryptionIv?: string) {
    this.passwordSalt = passwordSalt || this._generateSalt();
    this.encryptionIv = encryptionIv || this._generateIv();
  }

  async encrypt(password: string, data: any) {
    const passwordDerivedKey = await this._keyFromPassword(password, this.passwordSalt);
    return this._encryptWithKey(passwordDerivedKey, data, this.encryptionIv);
  }

  async decrypt(password: string, data: string) {
    const passwordDerivedKey = await this._keyFromPassword(password, this.passwordSalt);
    return this._decryptWithKey(passwordDerivedKey, data, this.encryptionIv);
  }

  async _encryptWithKey(key: CryptoKey, dataObj: any, iv: string) {
    const ivArray = Buffer.from(iv, "base64");
    const data = JSON.stringify(dataObj);
    const dataBuffer = Buffer.from(data, "utf8");
    const buf = await global.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: ivArray
      },
      key,
      dataBuffer
    );
    const buffer = new Uint8Array(buf);
    return Buffer.from(buffer).toString("base64");
  }

  async _decryptWithKey(key: CryptoKey, payload: string, iv: string) {
    const ivArray = Buffer.from(iv, "base64");
    try {
      const encryptedData = Buffer.from(payload, "base64");
      const buf = await global.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: ivArray
        },
        key,
        encryptedData
      );
      const decryptedData = new Uint8Array(buf);
      const decryptedStr = Buffer.from(decryptedData).toString("utf8");
      return JSON.parse(decryptedStr);
    } catch (error) {
      Logger.error(error);
      throw new Error("Incorrect password");
    }
  }

  async _keyFromPassword(password: string, salt: string): Promise<CryptoKey> {
    const passBuffer = Buffer.from(password, "utf8");
    const saltBuffer = Buffer.from(salt, "base64");

    const key = await global.crypto.subtle.importKey("raw", passBuffer, { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey"
    ]);
    return global.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBuffer, iterations: 10000, hash: "SHA-256" },
      key,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  _generateIv(byteCount: number = 16): string {
    const iv = new Uint8Array(byteCount);
    global.crypto.getRandomValues(iv);
    return Buffer.from(iv).toString("base64");
  }

  _generateSalt(byteCount: number = 32) {
    const salt = new Uint8Array(byteCount);
    global.crypto.getRandomValues(salt);
    return Buffer.from(salt).toString("base64");
  }
}
