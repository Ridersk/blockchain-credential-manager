import * as anchor from "@project-serum/anchor";
import { encryptData } from "utils/aes-encryption";
import { Credential } from "models/Credential";

import getSolanaWorkspace from "../solana/solanaWeb3";

const { program, userKeypair } = getSolanaWorkspace();

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

export const editCredential = async ({
  credentialPubKey,
  uid,
  iconUrl = "",
  title,
  url,
  label,
  secret,
  description
}: EditCredentialParameters) => {
  await program.methods
    .editCredential(
      new anchor.BN(uid),
      title,
      url,
      iconUrl,
      encryptData(userKeypair.secretKey, label),
      encryptData(userKeypair.secretKey, secret),
      description
    )
    .accounts({
      credentialAccount: credentialPubKey,
      owner: userKeypair.publicKey
    })
    .signers([userKeypair])
    .rpc();

  // Fetch credential edited account
  let credentialAccount = await program.account.credentialAccount.fetch(credentialPubKey);

  return new Credential(credentialPubKey, credentialAccount);
};
