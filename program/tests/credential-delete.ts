import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";
import { getPdaParams, requestAirdrop } from "./utils/testing-utils";
import { EncryptionUtils } from "./utils/aes-encryption";

global.crypto = require("crypto").webcrypto;

const { SystemProgram, Keypair } = anchor.web3;

const provider = anchor.AnchorProvider.env();
const programId = SystemProgram.programId;
anchor.setProvider(provider);

const program = anchor.workspace
  .BlockchainCredentialManager as Program<BlockchainCredentialManager>;

const CREDENTIAL_NAMESPACE = "credential";

/*
 * CREDENTIAL DELETION
 */
describe("credential-deletion", () => {
  const encryptor = new EncryptionUtils();
  const password = "password123";

  it("Can delete a existing credential account", async () => {
    // Creating credential
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "Github Credentials";
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    const encryptedCredentialData = await encryptor.encrypt(password, {
      title,
      url,
      label,
      secret,
      description,
    });

    await program.rpc.createCredential(
      credentialPda.uid,
      encryptedCredentialData,
      encryptor.encryptionIv,
      encryptor.passwordSalt,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          owner: owner.publicKey,
          systemProgram: programId,
        },
        signers: [owner],
      }
    );

    // Deleting credential
    await program.rpc.deleteCredential({
      accounts: {
        credentialAccount: credentialAccountKey,
        owner: owner.publicKey,
      },
      signers: [owner],
    });

    // Check if credential still exists
    await assert.rejects(
      program.account.credentialAccount.fetch(credentialAccountKey),
      (error: Error) => {
        assert.strictEqual(
          error.message,
          `Account does not exist ${credentialAccountKey}`
        );
        return true;
      }
    );
  });

  it("Cannot delete a credential of another user", async () => {
    // Creating credential
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "Github Credentials";
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    const encryptedCredentialData = await encryptor.encrypt(password, {
      title,
      url,
      label,
      secret,
      description,
    });

    await program.rpc.createCredential(
      credentialPda.uid,
      encryptedCredentialData,
      encryptor.encryptionIv,
      encryptor.passwordSalt,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          owner: owner.publicKey,
          systemProgram: programId,
        },
        signers: [owner],
      }
    );

    // Deleting credential
    const user2 = Keypair.generate();

    await assert.rejects(
      program.rpc.deleteCredential({
        accounts: {
          credentialAccount: credentialAccountKey,
          owner: owner.publicKey,
        },
        signers: [user2],
      }),
      (error: Error) => {
        assert.strictEqual(
          `unknown signer: ${user2.publicKey.toBase58()}`,
          error.message
        );
        return true;
      }
    );
  });
});
