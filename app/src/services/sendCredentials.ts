import * as anchor from "@project-serum/anchor";
import * as bs58 from "bs58";
const CryptoJS = require("crypto-js");

import { solanaWeb3, requestAirdrop } from "./solanaWeb3";

const { SystemProgram, PublicKey } = anchor.web3;
const { program, userKeypair } = solanaWeb3();

const CREDENTIAL_NAMESPACE = "credential";

const programId = SystemProgram.programId;

interface NewCredentialParameters {
  title: string;
  label: string;
  labelPath: string;
  secret: string;
  secretPath: string;
  websiteUrl: string;
}

export class Credential {
  publicKey: anchor.web3.PublicKey;
  title: string;
  label: string;
  labelPath: string;
  secret: string;
  secretPath: string;
  websiteUrl: string;

  constructor(publicKey: anchor.web3.PublicKey, accountData: NewCredentialParameters) {
    this.publicKey = publicKey;
    this.title = accountData.title;
    this.label = accountData.label;
    this.labelPath = accountData.labelPath;
    this.secret = accountData.secret;
    this.secretPath = accountData.secretPath;
    this.websiteUrl = accountData.websiteUrl;
  }
}

export const sendCredential = async ({ title, label, labelPath, secret, secretPath, websiteUrl }: NewCredentialParameters) => {
  // Request Airdrop for user wallet
  await requestAirdrop(program, userKeypair);

  const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, userKeypair);
  const credentialAccountKey = credentialPda.accountKey;

  await program.rpc.createCredential(
    credentialPda.uid,
    credentialPda.bump,
    title,
    encryptData(userKeypair.secretKey, label),
    encryptData(userKeypair.secretKey, secret),
    websiteUrl,
    labelPath,
    secretPath,
    {
      accounts: {
        credentialAccount: credentialAccountKey,
        author: userKeypair.publicKey,
        systemProgram: programId
      },
      signers: [userKeypair]
    }
  );

  // Fetch credential created account
  let credentialAccount = await program.account.credentialAccount.fetch(credentialAccountKey);

  return new Credential(credentialAccountKey, credentialAccount);
};

interface PDAParameters {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}

window.Buffer = window.Buffer || require("buffer").Buffer;

const getPdaParams = async (namespace: string, author: anchor.web3.Keypair): Promise<PDAParameters> => {
  const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));

  console.log("USER Key Pair:", author);
  console.log("UID:", uid.toArray("be", 8));

  // toBuffer() is a node-js method. Search an alternative for browser
  const uidBuffer = uid.toArray("be", 8);

  const [accountKey, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(namespace), author.publicKey.toBuffer(), Buffer.from(uidBuffer)],
    program.programId
  );

  console.log("ACCOUNT KEY:", accountKey);

  return { uid, accountKey, bump };
};

const encryptData = (secretKey: Uint8Array, data: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const encodedData = CryptoJS.AES.encrypt(data, bs58EncodedSecretKey);
  return encodedData.toString();
};

const decryptData = (secretKey: Uint8Array, encryptedData: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, bs58EncodedSecretKey);
  return decryptedData.toString(CryptoJS.enc.Utf8);
};
