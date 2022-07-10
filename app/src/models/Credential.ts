import * as anchor from "@project-serum/anchor";
import workspace, { SolanaWeb3Workspace } from "services/solana/solanaWeb3";
import { decryptData } from "utils/aes-encryption";

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
    const { userKeypair } = workspace() as SolanaWeb3Workspace;
    return decryptData(userKeypair.secretKey, this._label);
  }

  get secret() {
    const { userKeypair } = workspace() as SolanaWeb3Workspace;
    return decryptData(userKeypair.secretKey, this._secret);
  }
}
