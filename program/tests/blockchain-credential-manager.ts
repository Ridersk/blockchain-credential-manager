import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import * as bs58 from "bs58";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";
const CryptoJS = require("crypto-js");

const { SystemProgram, PublicKey, Keypair } = anchor.web3;

const provider = anchor.AnchorProvider.env();
const programId = SystemProgram.programId;
anchor.setProvider(provider);

const program = anchor.workspace
  .BlockchainCredentialManager as Program<BlockchainCredentialManager>;

interface CredentialPDAParameters {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}

const getPdaParams = async (
  namespace: string,
  author: anchor.web3.Keypair | any
): Promise<CredentialPDAParameters> => {
  const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
  const uidBuffer = uid.toBuffer("be", 8);

  const [accountKey, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from(namespace),
      author.publicKey.toBuffer(),
      Buffer.from(uidBuffer),
    ],
    program.programId
  );

  return { uid, accountKey, bump };
};

const requestAirdrop = async (author: anchor.web3.Keypair) => {
  // Request airdrop of 1 SOL
  await program.provider.connection.confirmTransaction(
    await program.provider.connection.requestAirdrop(
      author.publicKey,
      1000000000
    )
  );
};

const encryptData = (secretKey: Uint8Array, data: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const encodedData = CryptoJS.AES.encrypt(data, bs58EncodedSecretKey);
  return encodedData.toString();
};

const decryptData = (secretKey: Uint8Array, encryptedData: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedData,
    bs58EncodedSecretKey
  );
  return decryptedData.toString(CryptoJS.enc.Utf8);
};

const CREDENTIAL_NAMESPACE = "credential";

describe("credential-creation", () => {
  it("Can add new credential", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "Github Credentials";
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    await program.rpc.createCredential(
      credentialPda.uid,
      title,
      url,
      encryptData(author.secretKey, label),
      encryptData(author.secretKey, secret),
      description,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          author: author.publicKey,
          systemProgram: programId,
        },
        signers: [author],
      }
    );

    let credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );

    // Assertions
    console.log("Credential Account Data", credentialAccountData);

    assert.equal(
      author.publicKey.toBase58(),
      credentialAccountData.ownerAddress.toBase58()
    );
    assert.equal(
      credentialPda.uid.toNumber(),
      credentialAccountData.uid.toNumber()
    );
    assert.equal(title, credentialAccountData.title);
    assert.equal(url, credentialAccountData.url);
    assert.notEqual(label, credentialAccountData.label);
    assert.equal(
      label,
      decryptData(author.secretKey, credentialAccountData.label)
    );
    assert.notEqual(secret, credentialAccountData.secret);
    assert.equal(
      secret,
      decryptData(author.secretKey, credentialAccountData.secret)
    );
    assert.equal(description, credentialAccountData.description);
  });

  it("Cannot add new credential with title more than 50 characters", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "x".repeat(51);
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    try {
      await program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptData(author.secretKey, label),
        encryptData(author.secretKey, secret),
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            author: author.publicKey,
            systemProgram: programId,
          },
          signers: [author],
        }
      );
    } catch ({ error, name }) {
      assert.strictEqual("Error", name);
      assert.strictEqual(
        "O título deve ter no máximo 50 caracteres.",
        error.errorMessage
      );
      return true;
    }

    assert.fail(
      "The instruction should have failed with a 51-character title."
    );
  });

  it("Cannot add new credential with url more than 100 characters", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "x".repeat(50);
    const url = "x".repeat(101);
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    try {
      await program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptData(author.secretKey, label),
        encryptData(author.secretKey, secret),
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            author: author.publicKey,
            systemProgram: programId,
          },
          signers: [author],
        }
      );
    } catch ({ error, name }) {
      assert.strictEqual("Error", name);
      assert.strictEqual(
        "A URL deve ter no máximo 100 caracteres.",
        error.errorMessage
      );
      return true;
    }

    assert.fail("The instruction should have failed with a 101-character url.");
  });

  it("Cannot add new credential with label more than 100 characters", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const label = "x".repeat(101);
    const secret = "password123";
    const description = "Github Login";

    try {
      await program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptData(author.secretKey, label),
        encryptData(author.secretKey, secret),
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            author: author.publicKey,
            systemProgram: programId,
          },
          signers: [author],
        }
      );
    } catch ({ error, name }) {
      assert.strictEqual("Error", name);
      assert.strictEqual(
        "Tamanho da label ultrapassou o limite após encriptação.",
        error.errorMessage
      );
      return true;
    }

    assert.fail(
      "The instruction should have failed with a 129-character label."
    );
  });

  it("Cannot add new credential with secret more than 100 characters", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const label = "x".repeat(48);
    const secret = "x".repeat(101);
    const description = "Github Login";

    try {
      await program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptData(author.secretKey, label),
        encryptData(author.secretKey, secret),
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            author: author.publicKey,
            systemProgram: programId,
          },
          signers: [author],
        }
      );
    } catch ({ error, name }) {
      assert.strictEqual("Error", name);
      assert.strictEqual(
        "Tamanho da senha ultrapassou o limite após encriptação.",
        error.errorMessage
      );
      return true;
    }

    assert.fail(
      "The instruction should have failed with a 129-character password."
    );
  });

  it("Cannot add new credential with description more than 100 characters", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "x".repeat(50);
    const url = "x".repeat(100);
    const label = "x".repeat(48);
    const secret = "x".repeat(48);
    const description = "x".repeat(101);

    console.log("SECRET LOG:", encryptData(author.secretKey, secret).length);

    try {
      await program.rpc.createCredential(
        credentialPda.uid,
        title,
        url,
        encryptData(author.secretKey, label),
        encryptData(author.secretKey, secret),
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            author: author.publicKey,
            systemProgram: programId,
          },
          signers: [author],
        }
      );
    } catch ({ error, name }) {
      assert.strictEqual("Error", name);
      assert.strictEqual(
        "A descrição deve ter no máximo 100 caracteres.",
        error.errorMessage
      );
      return true;
    }

    assert.fail(
      "The instruction should have failed with a 101-character description."
    );
  });
});

describe("credential-edition", () => {
  let author;
  let credentialPda;

  it("Create support credential account", async () => {
    author = Keypair.generate();
    credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "Github Credentials";
    const url = "https://github.com";
    const label = "user-001";
    const secret = "password123";
    const description = "Github Login";

    await program.rpc.createCredential(
      credentialPda.uid,
      title,
      url,
      encryptData(author.secretKey, label),
      encryptData(author.secretKey, secret),
      description,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          author: author.publicKey,
          systemProgram: programId,
        },
        signers: [author],
      }
    );
  });

  it("Can edit a existing credential account", async () => {
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "Github Credentials [UPDATE]";
    const url = "https://www.github.com";
    const label = "user-002";
    const secret = "password1234";
    const description = "Github Login [UPDATED]";

    await program.rpc.editCredential(
      credentialPda.uid,
      title,
      url,
      encryptData(author.secretKey, label),
      encryptData(author.secretKey, secret),
      description,
      {
        accounts: {
          credentialAccount: credentialAccountKey,
          author: author.publicKey,
          systemProgram: programId,
        },
        signers: [author],
      }
    );

    let credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAccountKey
    );

    // Assertions
    console.log("Credential Account Data", credentialAccountData);

    assert.equal(
      author.publicKey.toBase58(),
      credentialAccountData.ownerAddress.toBase58()
    );
    assert.equal(
      credentialPda.uid.toNumber(),
      credentialAccountData.uid.toNumber()
    );
    assert.equal(title, credentialAccountData.title);
    assert.equal(url, credentialAccountData.url);
    assert.notEqual(label, credentialAccountData.label);
    assert.equal(
      label,
      decryptData(author.secretKey, credentialAccountData.label)
    );
    assert.notEqual(secret, credentialAccountData.secret);
    assert.equal(
      secret,
      decryptData(author.secretKey, credentialAccountData.secret)
    );
    assert.equal(description, credentialAccountData.description);
  });

  it("Cannot edit a existing credential of another user", async () => {
    const author2 = Keypair.generate();
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "Github Credentials [UPDATE]";
    const url = "https://www.github.com";
    const label = "user-002";
    const secret = "password1234";
    const description = "Github Login [UPDATED]";

    try {
      await program.rpc.editCredential(
        credentialPda.uid,
        title,
        url,
        encryptData(author.secretKey, label),
        encryptData(author.secretKey, secret),
        description,
        {
          accounts: {
            credentialAccount: credentialAccountKey,
            author: author.publicKey,
            systemProgram: programId,
          },
          signers: [author2],
        }
      );
    } catch (err) {
      assert.strictEqual("Error", err.name);
      assert.strictEqual(
        `unknown signer: ${author2.publicKey.toBase58()}`,
        err.message
      );
      return true;
    }

    assert.fail(
      "The instruction should have failed with a unauthorized user " +
        "trying modify credential data of another user."
    );
  });
});
