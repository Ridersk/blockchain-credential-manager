import * as anchor from "@project-serum/anchor";
import { Credential } from "../../../../models/Credential";

import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../../../idl/blockchain_credential_manager.json";
import { BlockchainCredentialManager } from "../../../../idl/blockchain_credential_manager";
import { LedgerProgram } from "../ledger";
import { FilterOption, ownerFilter } from "./ledger-filters";
import { extractURLOrigin } from "../../../../utils/url";
import { EncryptionUtils } from "../../../../utils/aes-encryption";
import { filterCredentialsByURL } from "../../../../utils/credential-filters";

const CREDENTIAL_NAMESPACE = "credential";

export class CredentialsController {
  private _ledgerProgram: LedgerProgram<BlockchainCredentialManager>;
  private _program: anchor.Program<BlockchainCredentialManager>;
  private _keypair: Keypair;
  private _password: string;

  constructor(url: string, keypair: Keypair, password: string) {
    this._ledgerProgram = new LedgerProgram<BlockchainCredentialManager>(url, keypair, idl as any);
    this._program = this._ledgerProgram.program;
    this._keypair = keypair;
    this._password = password;
  }

  get ledgerProgram(): LedgerProgram<BlockchainCredentialManager> {
    return this._ledgerProgram;
  }

  async getCredential(address: string) {
    const credential = await this._program.account.credentialAccount.fetch(address);
    const encryptor = new EncryptionUtils(credential.salt, credential.iv);
    const decryptedCredential = await encryptor.decrypt(this._password, credential.credentialData);

    try {
      return new Credential(address, {
        uid: credential.uid.toNumber(),
        title: decryptedCredential.title,
        url: decryptedCredential.url,
        label: decryptedCredential.label,
        secret: decryptedCredential.secret,
        description: decryptedCredential.description
      });
    } catch (e) {
      return new Credential(address, {
        uid: credential.uid.toNumber(),
        title: "<ENCRYPTED>",
        url: "<ENCRYPTED>",
        label: "<ENCRYPTED>",
        secret: "<ENCRYPTED>",
        description: "<ENCRYPTED>"
      });
    }
  }

  async getCredentials(): Promise<Array<Credential>> {
    const ledgerQueryFilters: Array<FilterOption> = [];
    ledgerQueryFilters.push(ownerFilter(this._keypair?.publicKey?.toBase58()));
    const credentials = await this._program.account.credentialAccount.all(ledgerQueryFilters);

    return Promise.all(
      credentials.map(async (credential) => {
        const credentialAccount = credential.account;
        const encryptor = new EncryptionUtils(credentialAccount.salt, credentialAccount.iv);
        const decryptedCredential = await encryptor.decrypt(
          this._password,
          credentialAccount.credentialData
        );
        try {
          return new Credential(credential?.publicKey?.toBase58(), {
            uid: credentialAccount.uid.toNumber(),
            title: decryptedCredential.title,
            url: decryptedCredential.url,
            label: decryptedCredential.label,
            secret: decryptedCredential.secret,
            description: decryptedCredential.description
          });
        } catch (e) {
          return new Credential(credential?.publicKey?.toBase58(), {
            uid: credentialAccount.uid.toNumber(),
            title: "<ENCRYPTED>",
            url: "<ENCRYPTED>",
            label: "<ENCRYPTED>",
            secret: "<ENCRYPTED>",
            description: "<ENCRYPTED>"
          });
        }
      })
    );
  }

  async getCredentialsFromCurrentTabURL() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const urlOrigin = extractURLOrigin(tab.url!);
    return filterCredentialsByURL(await this.getCredentials(), urlOrigin);
  }

  async createCredential({ title, url, label, secret, description }: NewCredentialParams) {
    const ownerPublicKey = this._keypair.publicKey;
    const credentialPda = await this._getPdaParams(CREDENTIAL_NAMESPACE, ownerPublicKey.toBuffer());
    const credentialAccountKey = credentialPda.accountKey;
    const encryptor = new EncryptionUtils();
    const encryptedCredential = await encryptor.encrypt(this._password, {
      title,
      url,
      label,
      secret,
      description
    });
    const tx = await this._program.methods
      .createCredential(
        credentialPda.uid,
        encryptedCredential,
        encryptor.encryptionIv,
        encryptor.passwordSalt
      )
      .accounts({
        credentialAccount: credentialAccountKey,
        owner: ownerPublicKey,
        systemProgram: SystemProgram.programId
      })
      .transaction();

    await this._ledgerProgram.sendTransaction(tx, this._keypair);
  }

  async editCredential({
    address,
    uid,
    title,
    url,
    label,
    secret,
    description
  }: EditCredentialParams) {
    const ownerPublicKey = this._keypair.publicKey;
    const encryptor = new EncryptionUtils();
    const encryptedCredential = await encryptor.encrypt(this._password, {
      title,
      url,
      label,
      secret,
      description
    });
    const tx = await this._program.methods
      .editCredential(
        new anchor.BN(uid),
        encryptedCredential,
        encryptor.encryptionIv,
        encryptor.passwordSalt
      )
      .accounts({
        credentialAccount: address,
        owner: ownerPublicKey
      })
      .transaction();

    await this._ledgerProgram.sendTransaction(tx, this._keypair);
  }

  async deleteCredential(address: string) {
    const ownerPublicKey = this._keypair.publicKey;

    const tx = await this._program.methods
      .deleteCredential()
      .accounts({
        credentialAccount: address,
        owner: ownerPublicKey
      })
      .transaction();

    await this._ledgerProgram.sendTransaction(tx, this._keypair);
  }

  private async _getPdaParams(namespace: string, ownerPublicKey: Buffer): Promise<PDAParams> {
    const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
    const uidBuffer = uid.toArray("be", 8);

    const [accountKey, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(namespace), ownerPublicKey, Buffer.from(uidBuffer)],
      this._program.programId
    );

    return { uid, accountKey, bump };
  }
}

export interface NewCredentialParams {
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

export interface EditCredentialParams {
  address: string;
  uid: number;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

interface PDAParams {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}
