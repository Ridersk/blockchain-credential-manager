import * as bs58 from "bs58";
const CryptoJS = require("crypto-js");

export const encryptData = (secretKey: Uint8Array, data: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const encodedData = CryptoJS.AES.encrypt(data, bs58EncodedSecretKey);
  return encodedData.toString();
};

export const decryptData = (secretKey: Uint8Array, encryptedData: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, bs58EncodedSecretKey);
  return decryptedData.toString(CryptoJS.enc.Utf8);
};
