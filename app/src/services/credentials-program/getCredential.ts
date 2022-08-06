import getSolanaWorkspace from "../solana/solanaWeb3";
import { web3 } from "@project-serum/anchor";
import { Credential } from "models/Credential";

const { program } = getSolanaWorkspace();

export default async function getCredential(publicKey: web3.PublicKey) {
  const credential = await program.account.credentialAccount.fetch(publicKey);
  return new Credential(publicKey, credential);
}
