import * as anchor from "@project-serum/anchor";

import { solanaWeb3, requestAirdrop } from "../solanaWeb3";

const { program, userKeypair } = solanaWeb3();

interface DeleteCredentialProps {
  credentialPubKey: anchor.web3.PublicKey;
}

export const deleteCredential = async ({ credentialPubKey }: DeleteCredentialProps) => {
  await program.rpc.deleteCredential({
    accounts: {
      credentialAccount: credentialPubKey,
      owner: userKeypair.publicKey
    },
    signers: [userKeypair]
  });
};
