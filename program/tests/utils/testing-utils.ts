import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import * as bs58 from "bs58";
import { BlockchainCredentialManager } from "../../target/types/blockchain_credential_manager";
const CryptoJS = require("crypto-js");

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
  owner: anchor.web3.Keypair | any
): Promise<CredentialPDAParameters> => {
  const uid = new anchor.BN(parseInt((Date.now() / 1000).toString()));
  const uidBuffer = uid.toBuffer("be", 8);

  const [accountKey, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from(namespace),
      owner.publicKey.toBuffer(),
      Buffer.from(uidBuffer),
    ],
    program.programId
  );

  return { uid, accountKey, bump };
};

export const requestAirdrop = async (owner: anchor.web3.Keypair) => {
  // Request airdrop of 1 SOL
  await program.provider.connection.confirmTransaction(
    await program.provider.connection.requestAirdrop(
      owner.publicKey,
      1000000000
    )
  );
};

export const encryptData = (secretKey: Uint8Array, data: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const encodedData = CryptoJS.AES.encrypt(data, bs58EncodedSecretKey);
  return encodedData.toString();
};

export const decryptData = (secretKey: Uint8Array, encryptedData: string) => {
  const bs58EncodedSecretKey = bs58.encode(secretKey);
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedData,
    bs58EncodedSecretKey
  );
  return decryptedData.toString(CryptoJS.enc.Utf8);
};
