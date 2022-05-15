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

describe("blockchain-credential-manager", () => {
  const CREDENTIAL_NAMESPACE = "credential";

  const getPdaParams = async (
    namespace: string,
    author: anchor.web3.Keypair | any
  ): Promise<CredentialPDAParameters> => {
    const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
    const uidBuffer = uid.toBuffer("be", 8);

    const [accountKey, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(namespace), author.publicKey.toBuffer(), uidBuffer],
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

  it("Can add new credential", async () => {
    const author = Keypair.generate();
    const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, author);
    const credentialAccountKey = credentialPda.accountKey;
    await requestAirdrop(author);

    const title = "Github Credentials";
    const label = "user-001";
    const labelPath = '//*[@id="login_field"]';
    const secret = "password123";
    const secretPath = '//*[@type="password"]';
    const websiteUrl = "https://github.com";

    await program.rpc.createCredential(
      credentialPda.uid,
      credentialPda.bump,
      title,
      encryptData(author.secretKey, label),
      encryptData(author.secretKey, secret),
      websiteUrl,
      labelPath,
      secretPath,
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
    assert.equal(websiteUrl, credentialAccountData.websiteUrl);
    assert.equal(labelPath, credentialAccountData.labelPath);
    assert.equal(secretPath, credentialAccountData.secretPath);
  });
});
