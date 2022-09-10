import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  Connection,
  Keypair,
  PublicKey as PublicKeyStruct,
} from "@solana/web3.js";

import idl from "../idl/blockchain_credential_manager.json";
import { BlockchainCredentialManager } from "../idl/blockchain_credential_manager";
import { AccountSigner } from "./models";

require("dotenv").config();

export const CLUSTER_URL = process.env.CLUSTER_URL!;

export const programID = new PublicKeyStruct(idl.metadata.address);
export const connection = new Connection(CLUSTER_URL, "confirmed");

let program: anchor.Program<BlockchainCredentialManager>;

export const generateKeyPair = () => {
  return Keypair.generate();
};

export const initializeProgram = (keyPair: Keypair) => {
  const vaultSigner = new AccountSigner(keyPair);
  const provider = new AnchorProvider(connection, vaultSigner, {
    preflightCommitment: "processed",
    commitment: "confirmed",
  });
  program = new Program<BlockchainCredentialManager>(
    idl as any,
    programID,
    provider
  );
  anchor.setProvider(provider);

  return {
    program,
    provider,
    keyPair,
  };
};

interface CredentialPDAParameters {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}

export const getPdaParams = async (
  namespace: string,
  ownerPublicKeyBuffer: Buffer
): Promise<CredentialPDAParameters> => {
  const uid = new anchor.BN(parseInt((Date.now()).toString()));
  const uidBuffer = uid.toBuffer("be", 8);

  const [accountKey, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(namespace), ownerPublicKeyBuffer, Buffer.from(uidBuffer)],
    program.programId
  );

  return { uid, accountKey, bump };
};

export const requestAirdrop = async (ownerPublicKey: PublicKeyStruct) => {
  // Request airdrop of 1 SOL
  const connection = program.provider.connection;
  const latestBlockHash = await connection.getLatestBlockhash();
  const airdropSignature = await connection.requestAirdrop(
    ownerPublicKey,
    1000000000
  );

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
