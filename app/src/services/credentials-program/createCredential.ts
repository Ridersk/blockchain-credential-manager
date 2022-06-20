import * as anchor from "@project-serum/anchor";
import { encryptData } from "utils/aes-encryption";
import { Credential } from "models/Credential";

import getSolanaWorkspace from "services/solana/solanaWeb3";

const { SystemProgram, PublicKey } = anchor.web3;
const { program, userKeypair } = getSolanaWorkspace();
const programId = SystemProgram.programId;
const CREDENTIAL_NAMESPACE = "credential";

interface NewCredentialParameters {
  title: string;
  url: string;
  iconUrl?: string;
  label: string;
  secret: string;
  description: string;
}

export const createCredential = async ({ title, url, iconUrl = "", label, secret, description }: NewCredentialParameters) => {
  const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, userKeypair);
  const credentialAccountKey = credentialPda.accountKey;

  await program.rpc.createCredential(
    credentialPda.uid,
    title,
    url,
    iconUrl,
    encryptData(userKeypair.secretKey, label),
    encryptData(userKeypair.secretKey, secret),
    description,
    {
      accounts: {
        credentialAccount: credentialAccountKey,
        owner: userKeypair.publicKey,
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
  const uidBuffer = uid.toArray("be", 8);

  const [accountKey, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(namespace), author.publicKey.toBuffer(), Buffer.from(uidBuffer)],
    program.programId
  );

  console.log("USER Key Pair:", author);
  console.log("UID:", uid.toArray("be", 8));
  console.log("ACCOUNT KEY:", accountKey);

  return { uid, accountKey, bump };
};
