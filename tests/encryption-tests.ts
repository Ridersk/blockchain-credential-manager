const CryptoJS = require("crypto-js");

function encrypt(message = "", key = "") {
  const encoded = CryptoJS.AES.encrypt(message, key);
  return encoded.toString();
}
function decrypt(message = "", key = "") {
  var code = CryptoJS.AES.decrypt(message, key);
  var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

const encoded = encrypt("NADA", "teste123");
const decoded = decrypt(encoded, "teste123");

console.log("CODIFICADA:", encoded);
console.log("DECODIFICADA:", decoded);
