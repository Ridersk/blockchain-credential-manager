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
 * CREDENTIAL EDITION
 */
describe("credential-edition", () => {
  let owner;
  let credentialPda;
  const encryptor = new EncryptionUtils();
  const password = "password123";
  let existingAccountData;

  it("Create support credential account", async () => {
    owner = Keypair.generate();
    credentialPda = await getPdaParams(
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

    existingAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );
  });

  it("Can edit a existing credential account", async () => {
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "Github Credentials [UPDATE]";
    const url = "https://www.github.com";
    const label = "user-002";
    const secret = "password1234";
    const description = "Github Login [UPDATED]";

    const encryptedCredentialData = await encryptor.encrypt(password, {
      title,
      url,
      label,
      secret,
      description,
    });

    await program.rpc.editCredential(
      credentialPda.uid,
      encryptedCredentialData,
      encryptor.encryptionIv,
      encryptor.passwordSalt,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          owner: owner.publicKey,
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
    assert.equal(encryptor.encryptionIv, credentialAccountData.iv);
    assert.equal(encryptor.passwordSalt, credentialAccountData.salt);
    assert.ok(
      credentialAccountData.createdAt.toNumber() ===
        existingAccountData.createdAt.toNumber()
    );
    assert.ok(credentialAccountData.updatedAt.toNumber() > 0);
    assert.ok(
      credentialAccountData.updatedAt.toNumber() !==
        existingAccountData.updatedAt.toNumber()
    );
  });

  it("Cannot edit a existing credential of another user", async () => {
    const user2 = Keypair.generate();
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "Github Credentials [UPDATE]";
    const url = "https://www.github.com";
    const label = "user-002";
    const secret = "password1234";
    const description = "Github Login [UPDATED]";

    const encryptedCredentialData = await encryptor.encrypt(password, {
      title,
      url,
      label,
      secret,
      description,
    });

    await assert.rejects(
      program.rpc.editCredential(
        credentialPda.uid,
        encryptedCredentialData,
        encryptor.encryptionIv,
        encryptor.passwordSalt,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            owner: owner.publicKey,
          },
          signers: [user2],
        }
      ),
      (err: Error) => {
        assert.strictEqual("Error", err.name);
        assert.strictEqual(
          `unknown signer: ${user2.publicKey.toBase58()}`,
          err.message
        );
        return true;
      }
    );
  });
});
