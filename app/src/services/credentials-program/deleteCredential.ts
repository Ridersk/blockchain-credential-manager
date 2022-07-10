import * as anchor from "@project-serum/anchor";

import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";

interface DeleteCredentialProps {
  credentialPubKey: anchor.web3.PublicKey;
}

export default async function deleteCredential({ credentialPubKey }: DeleteCredentialProps) {
  const { program, userKeypair } = workspace() as SolanaWeb3Workspace;
  await program.methods
    .deleteCredential()
    .accounts({
      credentialAccount: credentialPubKey,
      owner: userKeypair.publicKey
    })
    .signers([userKeypair])
    .rpc();
}
