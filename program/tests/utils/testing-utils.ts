import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey as PublicKeyStruct } from "@solana/web3.js";
import { BlockchainCredentialManager } from "../../target/types/blockchain_credential_manager";

const { PublicKey } = anchor.web3;

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace
  .BlockchainCredentialManager as Program<BlockchainCredentialManager>;

interface CredentialPDAParameters {
  uid: anchor.BN;
  accountKey: anchor.web3.PublicKey;
  bump: number;
}

export const getPdaParams = async (
  namespace: string,
  ownerPublicKeyBuffer: Buffer
): Promise<CredentialPDAParameters> => {
  const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
  const uidBuffer = uid.toBuffer("be", 8);

  const [accountKey, bump] = await PublicKey.findProgramAddress(
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
