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
 * CREDENTIAL EDITION
 */
describe("credential-edition", () => {
  let owner;
  let credentialPda;

  it("Create support credential account", async () => {
    owner = Keypair.generate();
    credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, owner.publicKey.toBuffer());
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
  });

  it("Can edit a existing credential account", async () => {
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "Github Credentials [UPDATE]";
    const url = "https://www.github.com";
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "user-002";
    const secret = "password1234";
    const description = "Github Login [UPDATED]";

    await program.rpc.editCredential(
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

  it("Cannot edit a existing credential of another user", async () => {
    const user2 = Keypair.generate();
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(owner.publicKey);

    const title = "Github Credentials [UPDATE]";
    const url = "https://www.github.com";
    const iconUrl = "https://github.githubassets.com/favicons/favicon.svg";
    const label = "user-002";
    const secret = "password1234";
    const description = "Github Login [UPDATED]";

    await assert.rejects(
      program.rpc.editCredential(
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
