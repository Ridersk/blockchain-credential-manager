import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";
import { web3 } from "@project-serum/anchor";
import { Credential } from "models/Credential";

export default async function getCredential(publicKey: web3.PublicKey) {
  const { program } = workspace() as SolanaWeb3Workspace;
  const credential = await program.account.credentialAccount.fetch(publicKey);
  return new Credential(publicKey, credential);
}
