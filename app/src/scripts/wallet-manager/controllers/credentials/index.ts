import * as anchor from "@project-serum/anchor";
import { Credential } from "../../../../models/Credential";
import passEncryptor from "browser-passworder";

import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../../../idl/blockchain_credential_manager.json";
import { BlockchainCredentialManager } from "../../../../idl/blockchain_credential_manager";
import { LedgerProgram } from "../ledger";
import { FilterOption, ownerFilter } from "./filters";
import { sleep } from "../../../../utils/time";

const CREDENTIAL_NAMESPACE = "credential";

export class CredentialsController {
  private _ledgerProgram: LedgerProgram<BlockchainCredentialManager>;
  private _keypair: Keypair;
  private _encryptor: typeof passEncryptor;
  private _password: string;

  constructor(keypair: Keypair, password: string) {
    this._ledgerProgram = new LedgerProgram<BlockchainCredentialManager>(keypair, idl as any);
    this._keypair = keypair;
    this._password = password;
    this._encryptor = passEncryptor;
  }

  get ledgerProgram(): LedgerProgram<BlockchainCredentialManager> {
    return this._ledgerProgram;
  }

  async getCredential(publicKey: string) {
    const credential = await this._ledgerProgram.program.account.credentialAccount.fetch(publicKey);

    try {
      const decryptedCredentialData = await passEncryptor.decrypt(
        this._password,
        credential.credentialData
      );
      return new Credential(publicKey, {
        uid: credential.uid.toNumber(),
        title: credential.title,
        url: credential.url,
        iconUrl: credential.iconUrl,
        label: decryptedCredentialData.label,
        secret: decryptedCredentialData.secret,
        description: credential.description
      });
    } catch (e) {
      return new Credential(publicKey, {
        uid: credential.uid.toNumber(),
        title: credential.title,
        url: credential.url,
        iconUrl: credential.iconUrl,
        label: "not found",
        secret: "not found",
        description: credential.description
      });
    }
  }

  async getCredentials(filters: Array<FilterOption> = []): Promise<Array<Credential>> {
    filters.push(ownerFilter(this._keypair?.publicKey?.toBase58()));
    const credentials = await this._ledgerProgram.program.account.credentialAccount.all(filters);

    return Promise.all(
      credentials.map(async (credential) => {
        const credentialAccount = credential.account;
        try {
          const decryptedCredentialData = await passEncryptor.decrypt(
            this._password,
            credentialAccount.credentialData
          );

          return new Credential(credential?.publicKey?.toBase58(), {
            uid: credentialAccount.uid.toNumber(),
            title: credentialAccount.title,
            url: credentialAccount.url,
            iconUrl: credentialAccount.iconUrl,
            label: decryptedCredentialData.label,
            secret: decryptedCredentialData.secret,
            description: credentialAccount.description
          });
        } catch (e) {
          return new Credential(credential?.publicKey?.toBase58(), {
            uid: credentialAccount.uid.toNumber(),
            title: credentialAccount.title,
            url: credentialAccount.url,
            iconUrl: credentialAccount.iconUrl,
            label: "not found",
            secret: "not found",
            description: credentialAccount.description
          });
        }
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
    const credentialPda = await this._getPdaParams(CREDENTIAL_NAMESPACE, publicKey.toBuffer());
    const credentialAccountKey = credentialPda.accountKey;
    const encryptedCredentialData = await passEncryptor.encrypt(this._password, { label, secret });

    let status = "success";
    let errorMessage = "";
    try {
      await this._ledgerProgram.program.methods
        .createCredential(
          credentialPda.uid,
          title,
          url,
          iconUrl,
          encryptedCredentialData,
          description
        )
        .accounts({
          credentialAccount: credentialAccountKey,
          owner: publicKey,
          systemProgram: SystemProgram.programId
        })
        .rpc();
    } catch (e: any) {
      if (!(e instanceof ReferenceError)) {
        status = "error";
        if (e.error && e.error.errorMessage) {
          errorMessage = e.error?.errorMessage;
        } else {
          errorMessage = e.message;
        }
      }
    }

    await sleep(1000);
    return {
      status,
      errorMessage
    };
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
    const program = this._ledgerProgram.program;
    const encryptedCredentialData = await passEncryptor.encrypt(this._password, { label, secret });

    let status = "success";
    let errorMessage = "";
    try {
      await program.methods
        .editCredential(
          new anchor.BN(uid),
          title,
          url,
          iconUrl,
          encryptedCredentialData,
          description
        )
        .accounts({
          credentialAccount: address,
          owner: publicKey
        })
        .rpc();
    } catch (e: any) {
      if (!(e instanceof ReferenceError)) {
        status = "error";
        if (e.error && e.error.errorMessage) {
          errorMessage = e.error?.errorMessage;
        } else {
          errorMessage = e.message;
        }
      }
    }

    await sleep(1000);
    return {
      status,
      errorMessage
    };
  }

  async deleteCredential(address: string) {
    const publicKey = this._keypair.publicKey;
    const program = this._ledgerProgram.program;

    let status = "success";
    let errorMessage = "";
    try {
      await program.methods
        .deleteCredential()
        .accounts({
          credentialAccount: address,
          owner: publicKey
        })
        .rpc();
    } catch (e: any) {
      if (!(e instanceof ReferenceError)) {
        status = "error";
        if (e.error && e.error.errorMessage) {
          errorMessage = e.error?.errorMessage;
        } else {
          errorMessage = e.message;
        }
      }
    }

    await sleep(1000);
    return {
      status,
      errorMessage
    };
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
