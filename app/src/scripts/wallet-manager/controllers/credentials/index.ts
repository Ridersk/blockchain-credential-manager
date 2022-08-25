import * as anchor from "@project-serum/anchor";
import { Credential } from "../../../../models/Credential";

import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../../../idl/blockchain_credential_manager.json";
import { BlockchainCredentialManager } from "../../../../idl/blockchain_credential_manager";
import { LedgerProgram } from "../ledger";
import { FilterOption, ownerFilter } from "./ledger-filters";
import { sleep } from "../../../../utils/time";
import { extractURLOrigin } from "../../../../utils/url";
import { EncryptionUtils } from "../../../../utils/aes-encryption";

const CREDENTIAL_NAMESPACE = "credential";

export class CredentialsController {
  private _ledgerProgram: LedgerProgram<BlockchainCredentialManager>;
  private _keypair: Keypair;
  private _password: string;

  constructor(keypair: Keypair, password: string) {
    this._ledgerProgram = new LedgerProgram<BlockchainCredentialManager>(keypair, idl as any);
    this._keypair = keypair;
    this._password = password;
  }

  get ledgerProgram(): LedgerProgram<BlockchainCredentialManager> {
    return this._ledgerProgram;
  }

  async getCredential(address: string) {
    const credential = await this._ledgerProgram.program.account.credentialAccount.fetch(address);
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
    const credentials = await this._ledgerProgram.program.account.credentialAccount.all(
      ledgerQueryFilters
    );

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
    return this.getCredentials();
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

    try {
      await this._ledgerProgram.program.methods
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
        .rpc();
    } catch (e: any) {
      let errorMessage = "";
      if (!(e instanceof ReferenceError)) {
        if (e.error && e.error.errorMessage) {
          errorMessage = e.error?.errorMessage;
        } else {
          errorMessage = e.message;
        }

        throw new CredentialControllerError(errorMessage);
      }
    }

    await sleep(1000);
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
    const program = this._ledgerProgram.program;
    const encryptor = new EncryptionUtils();
    const encryptedCredential = await encryptor.encrypt(this._password, {
      title,
      url,
      label,
      secret,
      description
    });

    try {
      await program.methods
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
        .rpc();
    } catch (e: any) {
      if (!(e instanceof ReferenceError)) {
        let errorMessage = "";
        if (e.error && e.error.errorMessage) {
          errorMessage = e.error?.errorMessage;
        } else {
          errorMessage = e.message;
        }

        throw new CredentialControllerError(errorMessage);
      }
    }

    await sleep(1000);
  }

  async deleteCredential(address: string) {
    const ownerPublicKey = this._keypair.publicKey;
    const program = this._ledgerProgram.program;

    try {
      await program.methods
        .deleteCredential()
        .accounts({
          credentialAccount: address,
          owner: ownerPublicKey
        })
        .rpc();
    } catch (e: any) {
      if (!(e instanceof ReferenceError)) {
        let errorMessage = "";
        if (e.error && e.error.errorMessage) {
          errorMessage = e.error?.errorMessage;
        } else {
          errorMessage = e.message;
        }

        throw new CredentialControllerError(errorMessage);
      }
    }

    await sleep(1000);
  }

  private async _getPdaParams(namespace: string, ownerPublicKey: Buffer): Promise<PDAParams> {
    const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
    const uidBuffer = uid.toArray("be", 8);

    const [accountKey, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(namespace), ownerPublicKey, Buffer.from(uidBuffer)],
      this._ledgerProgram.program.programId
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

export class CredentialControllerError extends Error {
  constructor(message: string) {
    super(message);
  }
}
