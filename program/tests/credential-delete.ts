import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";
import {
  encryptData,
  getPdaParams,
  requestAirdrop,
} from "./utils/testing-utils";

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
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    await program.rpc.createCredential(
      credentialPda.uid,
      title,
      url,
      iconUrl,
      encryptData(owner.secretKey, label),
      encryptData(owner.secretKey, secret),
      description,
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
      (err: Error) => {
        assert.strictEqual(
          err.message,
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
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    await program.rpc.createCredential(
      credentialPda.uid,
      title,
      url,
      iconUrl,
      encryptData(owner.secretKey, label),
      encryptData(owner.secretKey, secret),
      description,
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
      (err: Error) => {
        assert.strictEqual(
          `unknown signer: ${user2.publicKey.toBase58()}`,
          err.message
        );
        return true;
      }
    );
  });
});
