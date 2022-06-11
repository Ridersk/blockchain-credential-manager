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
  publicKey: anchor.web3.PublicKey;
  title: string;
  url: string;
  private _label: string;
  private _secret: string;
  description: string;

  constructor(publicKey: anchor.web3.PublicKey, { title, url, label, secret, description }: CredentialParameters) {
    this.publicKey = publicKey;
    this.title = title;
    this.url = url;
    this._label = label;
    this._secret = secret;
    this.description = description;
  }

  get label() {
    return decryptData(userKeypair.secretKey, this._label);
  }

  get secret() {
    return decryptData(userKeypair.secretKey, this._secret);
  }
}
