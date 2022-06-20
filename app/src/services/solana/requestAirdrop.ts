import { Keypair } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

const requestAirdrop = async (program: Program<BlockchainCredentialManager>, author: Keypair) => {
  // Request airdrop of 1 SOL
  await program.provider.connection.confirmTransaction(await program.provider.connection.requestAirdrop(author.publicKey, 1000000000));
  console.log("Airdrop Provided!!!");
};

export default requestAirdrop;
