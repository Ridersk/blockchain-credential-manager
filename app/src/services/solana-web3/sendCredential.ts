import * as anchor from "@project-serum/anchor";
const CryptoJS = require("crypto-js");
import { decryptData, encryptData } from "utils/aes-encryption";

import { solanaWeb3, requestAirdrop } from "../solanaWeb3";

const { SystemProgram, PublicKey } = anchor.web3;
const { program, userKeypair } = solanaWeb3();

const CREDENTIAL_NAMESPACE = "credential";

const programId = SystemProgram.programId;

interface NewCredentialParameters {
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

export class Credential {
  publicKey: anchor.web3.PublicKey;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;

  constructor(publicKey: anchor.web3.PublicKey, accountData: NewCredentialParameters) {
    this.publicKey = publicKey;
    this.title = accountData.title;
    this.url = accountData.url;
    this.label = accountData.label;
    this.secret = accountData.secret;
    this.description = accountData.description;
  }
}

export const sendCredential = async ({ title, url, label, secret, description }: NewCredentialParameters) => {
  // Request Airdrop for user wallet
  await requestAirdrop(program, userKeypair);

  const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, userKeypair);
  const credentialAccountKey = credentialPda.accountKey;

  await program.rpc.createCredential(
    credentialPda.uid,
    credentialPda.bump,
    title,
    url,
    encryptData(userKeypair.secretKey, label),
    encryptData(userKeypair.secretKey, secret),
    description,
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

  for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    console.log("LABEL DECRIPTADA:", decryptData(userKeypair.secretKey, credentialAccount.label));
  }

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
