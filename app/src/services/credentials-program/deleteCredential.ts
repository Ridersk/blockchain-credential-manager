import * as anchor from "@project-serum/anchor";

import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";

interface DeleteCredentialProps {
  credentialPubKey: anchor.web3.PublicKey;
}

export default async function deleteCredential({ credentialPubKey }: DeleteCredentialProps) {
  const { program, publicKey } = workspace() as SolanaWeb3Workspace;
  await program.methods
    .deleteCredential()
    .accounts({
      credentialAccount: credentialPubKey,
      owner: publicKey
    })
    .rpc();
}
