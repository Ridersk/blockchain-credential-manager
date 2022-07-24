import * as anchor from "@project-serum/anchor";

interface CredentialParameters {
  uid: anchor.BN;
  title: string;
  url: string;
  iconUrl?: string;
  label: string;
  secret: string;
  description: string;
}

export class Credential {
  private _publicKey: anchor.web3.PublicKey;
  uid: number;
  title: string;
  url: string;
  iconUrl: string;
  private _label: string;
  private _secret: string;
  description: string;

  constructor(
    publicKey: anchor.web3.PublicKey,
    { uid, title, url, iconUrl = "", label, secret, description }: CredentialParameters
  ) {
    this._publicKey = publicKey;
    this.uid = uid.toNumber();
    this.title = title;
    this.url = url;
    this.iconUrl = iconUrl;
    this._label = label;
    this._secret = secret;
    this.description = description;
  }

  get publicKey() {
    return this._publicKey.toBase58();
  }

  get label() {
    return (async () => {
      try {
        return (await decryptDataFromBackgroundAction({ label: this._label })).label;
      } catch (e) {
        return "UNDEFINED LABEL";
      }
    })();
  }

  get secret() {
    return (async () => {
      try {
        return (await decryptDataFromBackgroundAction({ secret: this._secret })).secret;
      } catch (e) {
        return "UNDEFINED LABEL";
      }
    })();
  }
}

const decryptDataFromBackgroundAction = async (encryptedData: {
  [key: string]: string;
}): Promise<{ [key: string]: string }> => {
  const response = await chrome.runtime.sendMessage({
    action: "decryptData",
    data: encryptedData
  });
  const decryptedData: { [key: string]: string } = response?.data;
  console.log("RECEIVED DECRYPTED DATA:", decryptedData);
  return decryptedData;
};
