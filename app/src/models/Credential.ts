import * as anchor from "@project-serum/anchor";
import { solanaWeb3 } from "services/solanaWeb3";
import { decryptData } from "utils/aes-encryption";

const { userKeypair } = solanaWeb3();

interface CredentialParameters {
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

export class Credential {
  private _publicKey: anchor.web3.PublicKey;
  title: string;
  url: string;
  private _label: string;
  private _secret: string;
  description: string;

  constructor(publicKey: anchor.web3.PublicKey, { title, url, label, secret, description }: CredentialParameters) {
    this._publicKey = publicKey;
    this.title = title;
    this.url = url;
    this._label = label;
    this._secret = secret;
    this.description = description;
  }

  get publicKey() {
    return this._publicKey.toBase58();
  }

  get label() {
    return decryptData(userKeypair.secretKey, this._label);
  }

  get secret() {
    return decryptData(userKeypair.secretKey, this._secret);
  }
}
