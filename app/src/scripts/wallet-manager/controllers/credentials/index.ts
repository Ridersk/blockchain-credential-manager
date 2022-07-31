import * as anchor from "@project-serum/anchor";
import { Credential } from "../../../../models/Credential";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

import idl from "../../../../idl/blockchain_credential_manager.json";
import { BlockchainCredentialManager } from "../../../../idl/blockchain_credential_manager";
import { BaseLedgerProgram } from "../@shared/ledger/base-ledger-program";
import { FilterOption, ownerFilter } from "./filters";
import { encryptData, decryptData } from "../../../../utils/aes-encryption";

const CREDENTIAL_NAMESPACE = "credential";

export class CredentialsController {
  private _ledgerProgram: BaseLedgerProgram<BlockchainCredentialManager>;
  private _keypair: Keypair;

  constructor(keypair: Keypair) {
    this._ledgerProgram = new BaseLedgerProgram<BlockchainCredentialManager>(keypair, idl as any);
    this._keypair = keypair;
  }

  async getCredential(publicKey: string) {
    const credential = await this._ledgerProgram.program.account.credentialAccount.fetch(publicKey);
    const secretKey = this._keypair.secretKey;
    return new Credential(publicKey, {
      uid: credential.uid.toNumber(),
      title: credential.title,
      url: credential.url,
      iconUrl: credential.iconUrl,
      label: decryptData(secretKey, credential.label),
      secret: decryptData(secretKey, credential.secret),
      description: credential.description
    });
  }

  async getCredentials(filters: Array<FilterOption> = []): Promise<Array<Credential>> {
    filters.push(ownerFilter(this._keypair?.publicKey?.toBase58()));
    const credentials = await this._ledgerProgram.program.account.credentialAccount.all(filters);
    const secretKey = this._keypair.secretKey;

    return credentials.map(
      (credential) =>
        new Credential(credential?.publicKey?.toBase58(), {
          uid: credential.account.uid.toNumber(),
          title: credential.account.title,
          url: credential.account.url,
          iconUrl: credential.account.iconUrl,
          label: decryptData(secretKey, credential.account.label),
          secret: decryptData(secretKey, credential.account.secret),
          description: credential.account.description
        })
    );
  }

  async createCredential({
    title,
    url,
    iconUrl = "",
    label,
    secret,
    description
  }: NewCredentialParams) {
    const publicKey = this._keypair.publicKey;
    const secretKey = this._keypair.secretKey;
    const credentialPda = await this._getPdaParams(CREDENTIAL_NAMESPACE, publicKey.toBuffer());
    const credentialAccountKey = credentialPda.accountKey;
    const encryptedLabel = encryptData(secretKey, label);
    const encryptedSecret = encryptData(secretKey, secret);

    try {
      await this._ledgerProgram.program.methods
        .createCredential(
          credentialPda.uid,
          title,
          url,
          iconUrl,
          encryptedLabel,
          encryptedSecret,
          description
        )
        .accounts({
          credentialAccount: credentialAccountKey,
          owner: publicKey,
          systemProgram: SystemProgram.programId
        })
        .rpc();
    } catch (e) {
      console.error(e);
    }

    // Fetch credential created account
    let credentialAccount = await this._ledgerProgram.program.account.credentialAccount.fetch(
      credentialAccountKey
    );

    return new Credential(credentialAccountKey.toBase58(), {
      uid: credentialAccount.uid.toNumber(),
      title: credentialAccount.title,
      url: credentialAccount.url,
      iconUrl: credentialAccount.iconUrl,
      label: decryptData(secretKey, credentialAccount.label),
      secret: decryptData(secretKey, credentialAccount.secret),
      description: credentialAccount.description
    });
  }

  async editCredential({
    address,
    uid,
    iconUrl = "",
    title,
    url,
    label,
    secret,
    description
  }: EditCredentialParams) {
    const publicKey = this._keypair.publicKey;
    const secretKey = this._keypair.secretKey;
    const program = this._ledgerProgram.program;
    const encryptedLabel = encryptData(secretKey, label);
    const encryptedSecret = encryptData(secretKey, secret);

    try {
      await program.methods
        .editCredential(
          new anchor.BN(uid),
          title,
          url,
          iconUrl,
          encryptedLabel,
          encryptedSecret,
          description
        )
        .accounts({
          credentialAccount: address,
          owner: publicKey
        })
        .rpc();
    } catch (e) {
      console.error(e);
    }

    // Fetch credential edited account
    let credentialAccount = await program.account.credentialAccount.fetch(address);

    return new Credential(address, {
      uid: credentialAccount.uid.toNumber(),
      title: credentialAccount.title,
      url: credentialAccount.url,
      iconUrl: credentialAccount.iconUrl,
      label: decryptData(secretKey, credentialAccount.label),
      secret: decryptData(secretKey, credentialAccount.secret),
      description: credentialAccount.description
    });
  }

  async deleteCredential(address: string) {
    const publicKey = this._keypair.publicKey;
    const program = this._ledgerProgram.program;
    await program.methods
      .deleteCredential()
      .accounts({
        credentialAccount: address,
        owner: publicKey
      })
      .rpc();
  }

  private async _getPdaParams(
    namespace: string,
    authorPublicKeyBuffer: Buffer
  ): Promise<PDAParams> {
    const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
    const uidBuffer = uid.toArray("be", 8);

    const [accountKey, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(namespace), authorPublicKeyBuffer, Buffer.from(uidBuffer)],
      this._ledgerProgram.program.programId
    );

    return { uid, accountKey, bump };
  }
}

export interface NewCredentialParams {
  title: string;
  url: string;
  iconUrl?: string;
  label: string;
  secret: string;
  description: string;
}

export interface EditCredentialParams {
  address: string;
  uid: number;
  title: string;
  url: string;
  iconUrl: string;
  label: string;
  secret: string;
  description: string;
}

interface PDAParams {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}
