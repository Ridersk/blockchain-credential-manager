import { Keypair } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";

import { BlockchainCredentialManager } from "idl/blockchain_credential_manager";

const requestAirdrop = async (program: Program<BlockchainCredentialManager>, author: Keypair) => {
  // Request airdrop of 1 SOL
  const connection = program.provider.connection;
  const airdropSignature = await connection.requestAirdrop(author.publicKey, 1000000000);
  await connection.confirmTransaction(airdropSignature);
};

export default requestAirdrop;
