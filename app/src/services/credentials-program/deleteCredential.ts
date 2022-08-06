import * as anchor from "@project-serum/anchor";

import getSolanaWorkspace from "../solana/solanaWeb3";

const { program, userKeypair } = getSolanaWorkspace();

interface DeleteCredentialProps {
  credentialPubKey: anchor.web3.PublicKey;
}

export default async function deleteCredential({ credentialPubKey }: DeleteCredentialProps) {
  await program.methods
    .deleteCredential()
    .accounts({
      credentialAccount: credentialPubKey,
      owner: userKeypair.publicKey
    })
    .signers([userKeypair])
    .rpc();
}
