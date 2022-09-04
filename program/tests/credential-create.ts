import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";
import { getPdaParams, requestAirdrop } from "./utils/testing-utils";
import { EncryptionUtils } from "./utils/aes-encryption";

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
  const encryptor = new EncryptionUtils();
  const password = "password123";

  it("Can add new credential with provider default owner", async () => {
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
          owner: provider.wallet.publicKey,
          systemProgram: programId,
        },
      }
    );

    const credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );
    const decryptedCredential = await encryptor.decrypt(
      password,
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
    assert.equal(title, decryptedCredential.title);
    assert.equal(url, decryptedCredential.url);
    assert.equal(label, decryptedCredential.label);
    assert.equal(secret, decryptedCredential.secret);
    assert.equal(description, decryptedCredential.description);
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

    const credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );
    const decryptedCredential = await encryptor.decrypt(
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
    assert.equal(title, decryptedCredential.title);
    assert.equal(url, decryptedCredential.url);
    assert.equal(label, decryptedCredential.label);
    assert.equal(secret, decryptedCredential.secret);
    assert.equal(description, decryptedCredential.description);
  });

  it("Cannot exceed credential data", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(
      CREDENTIAL_NAMESPACE,
      owner.publicKey.toBuffer()
    );
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);
    const credential_data = "x".repeat(751);

    await assert.rejects(
      program.rpc.createCredential(
        credentialPda.uid,
        credential_data,
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
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual("Credential data too long.", error.errorMessage);
        return true;
      }
    );
  });
});
