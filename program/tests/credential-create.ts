import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";
import {
  decryptData,
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
 * CREDENTIAL CREATION
 */
describe("credential-creation", () => {
  it("Can add new credential", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner);

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

    let credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );

    // Assertions
    console.log("Credential Account Data", credentialAccountData);

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
    assert.equal(iconUrl, credentialAccountData.iconUrl);
    assert.notEqual(label, credentialAccountData.label);
    assert.equal(
      label,
      decryptData(owner.secretKey, credentialAccountData.label)
    );
    assert.notEqual(secret, credentialAccountData.secret);
    assert.equal(
      secret,
      decryptData(owner.secretKey, credentialAccountData.secret)
    );
    assert.equal(description, credentialAccountData.description);
  });

  it("Cannot add new credential with title more than 50 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner);

    const title = "x".repeat(51);
    const url = "https://github.com";
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
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
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "O título deve ter no máximo 50 caracteres.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential with url more than 100 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner);

    const title = "x".repeat(50);
    const url = "x".repeat(101);
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
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
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "A URL deve ter no máximo 100 caracteres.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential with label more than 100 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "x".repeat(101);
    const secret = "password123";
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
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
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "Tamanho da label ultrapassou o limite após encriptação.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential with secret more than 100 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "x".repeat(48);
    const secret = "x".repeat(101);
    const description = "Github Login";

    await assert.rejects(
      program.rpc.createCredential(
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
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "Tamanho da senha ultrapassou o limite após encriptação.",
          error.errorMessage
        );
        return true;
      }
    );
  });

  it("Cannot add new credential with description more than 100 characters", async () => {
    const owner = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "x".repeat(48);
    const secret = "x".repeat(48);
    const description = "x".repeat(101);

    console.log("SECRET LOG:", encryptData(owner.secretKey, secret).length);

    await assert.rejects(
      program.rpc.createCredential(
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
      ),
      ({ error, name }) => {
        assert.strictEqual("Error", name);
        assert.strictEqual(
          "A descrição deve ter no máximo 100 caracteres.",
          error.errorMessage
        );
        return true;
      }
    );
  });
});
