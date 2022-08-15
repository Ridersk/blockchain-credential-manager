import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";
import { getPdaParams, requestAirdrop } from "./utils/testing-utils";
import passEncryptor from "browser-passworder";

global.crypto = require("crypto").webcrypto;

const { SystemProgram, Keypair } = anchor.web3;

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const programId = SystemProgram.programId;
const program = anchor.workspace
  .BlockchainCredentialManager as Program<BlockchainCredentialManager>;

const CREDENTIAL_NAMESPACE = "credential";

/*
 * CREDENTIAL CREATION
 */
describe("credential-creation", () => {
  const password = "password123";

  it("Can add new credential with provider default owner without cryptograph", async () => {
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      provider.wallet.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;

    const title = "Github Credentials";
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";
    const credentialData = JSON.stringify({ label, secret });

    await program.rpc.createCredential(
      credentialPda.uid,
      title,
      url,
      credentialData,
      description,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          owner: provider.wallet.publicKey,
          systemProgram: programId,
        },
      }
    );

    const credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );
    const responseCredentialData = JSON.parse(
      credentialAccountData.credentialData
    );

    // Assertions
    assert.equal(
      provider.wallet.publicKey.toBase58(),
      credentialAccountData.owner.toBase58()
    );
    assert.equal(
      credentialPda.uid.toNumber(),
      credentialAccountData.uid.toNumber()
    );
    assert.equal(title, credentialAccountData.title);
    assert.equal(url, credentialAccountData.url);
    assert.equal(label, responseCredentialData.label);
    assert.equal(secret, responseCredentialData.secret);
    assert.equal(description, credentialAccountData.description);
  });

  it("Can add new credential with custom owner", async () => {
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
    const credentialData = { label, secret };
    const encryptedData = await passEncryptor.encrypt(password, credentialData);
    const description = "Github Login";

    await program.rpc.createCredential(
      credentialPda.uid,
      title,
      url,
      encryptedData,
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

    const credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );
    const responseCredentialData = await passEncryptor.decrypt(
      password,
      credentialAccountData.credentialData
    );

    // Assertions
    assert.equal(
      owner.publicKey.toBase58(),
      credentialAccountData.owner.toBase58()
    );
    assert.equal(
      credentialPda.uid.toNumber(),
      credentialAccountData.uid.toNumber()
    );
    assert.equal(title, credentialAccountData.title);
    assert.equal(url, credentialAccountData.url);
    assert.equal(label, responseCredentialData.label);
    assert.equal(secret, responseCredentialData.secret);
    assert.equal(description, credentialAccountData.description);
  });

  it("Cannot add new credential with title more than 50 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "x".repeat(51);
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const credentialData = { label, secret };
    const encryptedData = await passEncryptor.encrypt(password, credentialData);
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptedData,
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            owner: owner.publicKey,
            systemProgram: programId,
          },
          signers: [owner],
        }
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "Title should be 50 characters long maximum.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential with url more than 100 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "x".repeat(50);
    const url = "x".repeat(101);
    const label = "user-001";
    const secret = "password123";
    const credentialData = { label, secret };
    const encryptedData = await passEncryptor.encrypt(password, credentialData);
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptedData,
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            owner: owner.publicKey,
            systemProgram: programId,
          },
          signers: [owner],
        }
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "URL should be 100 characters long maximum.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential data more than 640 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const encryptedData = "x".repeat(641);
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptedData,
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            owner: owner.publicKey,
            systemProgram: programId,
          },
          signers: [owner],
        }
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "Credential data should be 512 characters long.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential with description more than 100 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const label = "x".repeat(48);
    const secret = "x".repeat(48);
    const credentialData = { label, secret };
    const encryptedData = await passEncryptor.encrypt(password, credentialData);
    const description = "x".repeat(101);

    await assert.rejects(
      program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptedData,
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            owner: owner.publicKey,
            systemProgram: programId,
          },
          signers: [owner],
        }
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "Description should be 100 characters long maximum.",
          error.errorMessage
        );
        return true;
      }
    );
  });
});
