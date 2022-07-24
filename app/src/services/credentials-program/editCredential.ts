import * as anchor from "@project-serum/anchor";
import { Credential } from "models/Credential";

import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";

interface EditCredentialParameters {
  credentialPubKey: anchor.web3.PublicKey;
  uid: number;
  title: string;
  url: string;
  iconUrl: string;
  label: string;
  secret: string;
  description: string;
}

export default async function editCredential({
  credentialPubKey,
  uid,
  iconUrl = "",
  title,
  url,
  label,
  secret,
  description
}: EditCredentialParameters) {
  const { program, publicKey } = workspace() as SolanaWeb3Workspace;
  const encryptedCredentials = await encryptDataFromBackgroundAction({ label, secret });

  await program.methods
    .editCredential(
      new anchor.BN(uid),
      title,
      url,
      iconUrl,
      encryptedCredentials.label,
      encryptedCredentials.secret,
      description
    )
    .accounts({
      credentialAccount: credentialPubKey,
      owner: publicKey
    })
    .rpc();

  // Fetch credential edited account
  let credentialAccount = await program.account.credentialAccount.fetch(credentialPubKey);

  return new Credential(credentialPubKey, credentialAccount);
}

const encryptDataFromBackgroundAction = async (data: {
  [key: string]: string;
}): Promise<{ [key: string]: string }> => {
  const response = await chrome.runtime.sendMessage({
    action: "encryptData",
    data
  });
  const encryptedData: { [key: string]: string } = response?.data;
  console.log("RECEIVED ENCRYPTED DATA:", encryptedData);
  return encryptedData;
};
