import * as anchor from "@project-serum/anchor";
import { Credential } from "models/Credential";

import workspace, { SolanaWeb3Workspace } from "services/solana/solanaWeb3";

const { SystemProgram, PublicKey } = anchor.web3;
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

export default async function createCredential({
  title,
  url,
  iconUrl = "",
  label,
  secret,
  description
}: NewCredentialParameters) {
  const { program, publicKey } = workspace() as SolanaWeb3Workspace;
  const credentialPda = await getPdaParams(CREDENTIAL_NAMESPACE, publicKey.toBuffer());
  const credentialAccountKey = credentialPda.accountKey;
  const encryptedCredentials = await encryptDataFromBackgroundAction({ label, secret });

  await program.methods
    .createCredential(
      credentialPda.uid,
      title,
      url,
      iconUrl,
      encryptedCredentials.label,
      encryptedCredentials.secret,
      description
    )
    .accounts({
      credentialAccount: credentialAccountKey,
      owner: publicKey,
      systemProgram: programId
    })
    .rpc();

  // Fetch credential created account
  let credentialAccount = await program.account.credentialAccount.fetch(credentialAccountKey);

  return new Credential(credentialAccountKey, credentialAccount);
}

interface PDAParameters {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}

window.Buffer = window.Buffer || require("buffer").Buffer;

const getPdaParams = async (
  namespace: string,
  authorPublicKeyBuffer: Buffer
): Promise<PDAParameters> => {
  const { program } = workspace() as SolanaWeb3Workspace;
  const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
  const uidBuffer = uid.toArray("be", 8);

  const [accountKey, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(namespace), authorPublicKeyBuffer, Buffer.from(uidBuffer)],
    program.programId
  );

  return { uid, accountKey, bump };
};

const encryptDataFromBackgroundAction = async (data: {
  [key: string]: string;
}): Promise<{ [key: string]: string }> => {
  const response = await chrome.runtime.sendMessage({
    action: "encryptData",
    data
  });
  const encryptedData: { [key: string]: string } = response?.data;
  return encryptedData;
};
