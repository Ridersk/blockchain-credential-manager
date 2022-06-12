import * as anchor from "@project-serum/anchor";
import { encryptData } from "utils/aes-encryption";
import { Credential } from "models/Credential";

import { solanaWeb3, requestAirdrop } from "../solanaWeb3";

const { SystemProgram } = anchor.web3;
const { program, userKeypair } = solanaWeb3();
const programId = SystemProgram.programId;

interface EditCredentialParameters {
  credentialPubKey: anchor.web3.PublicKey;
  uid: number;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

export const editCredential = async ({ credentialPubKey, uid, title, url, label, secret, description }: EditCredentialParameters) => {
  // Request Airdrop for user wallet
  await requestAirdrop(program, userKeypair);

  await program.rpc.editCredential(
    new anchor.BN(uid),
    title,
    url,
    encryptData(userKeypair.secretKey, label),
    encryptData(userKeypair.secretKey, secret),
    description,
    {
      accounts: {
        credentialAccount: credentialPubKey,
        author: userKeypair.publicKey,
        systemProgram: programId
      },
      signers: [userKeypair]
    }
  );

  // Fetch credential edited account
  let credentialAccount = await program.account.credentialAccount.fetch(credentialPubKey);

  return new Credential(credentialPubKey, credentialAccount);
};
