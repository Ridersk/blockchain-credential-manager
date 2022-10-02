import {
  generateKeyPair,
  getPdaParams,
  initializeProgram,
  requestAirdrop,
  sleep,
} from "./utils/testing-utils";

import { EncryptionUtils } from "./utils/aes-encryption";
import { Keypair, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { BlockchainCredentialManager } from "./idl/blockchain_credential_manager";

const argv = require("minimist")(process.argv.slice(2));

const CREDENTIAL_NAMESPACE = "credential";

async function createCredentialProc() {
  try {
    const credentialsCount = parseInt(argv.credentialsCount);
    const { program, provider, keyPair } = initializeProgram(generateKeyPair());
    await requestAirdrop(keyPair.publicKey);
    await sleep(10000);
    await requestAirdrop(keyPair.publicKey);
    let credentialsData = [];

    const startTime = process.hrtime();
    for (let i = 0; i < credentialsCount; i++) {
      credentialsData.push(await _createCredential(program, provider, keyPair));
    }
    const elapsedTime = parseHrtimeToSeconds(process.hrtime(startTime));

    process.stdout.write(
      JSON.stringify({ firstCredentialData: credentialsData[0], elapsedTime, credentialsCount })
    );

    process.exitCode = 0;
  } catch (error) {
    process.exitCode = 1;
    console.log(error);
  }
}

async function _createCredential(
  program: Program<BlockchainCredentialManager>,
  provider: AnchorProvider,
  keyPair: Keypair
) {
  const encryptor = new EncryptionUtils();
  const password = "00000000";

  const credentialPda = await getPdaParams(
    CREDENTIAL_NAMESPACE,
    provider.wallet.publicKey.toBuffer()
  );

  const credentialAccountKey = credentialPda.accountKey;
  const title = "Github Credentials";
  const url = "https://github.com";
  const label = "user-001";
  const secret = "password123";
  const description = "Github Login";

  const encryptedCredentialData = await encryptor.encrypt(password, {
    title,
    url,
    label,
    secret,
    description,
  });

  const startTime = process.hrtime();
  await program.methods
    .createCredential(
      credentialPda.uid,
      encryptedCredentialData,
      encryptor.encryptionIv,
      encryptor.passwordSalt
    )
    .accounts({
      credentialAccount: credentialAccountKey,
      owner: keyPair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  const elapsedTime = parseHrtimeToSeconds(process.hrtime(startTime));

  const credentialAccountData = await program.account.credentialAccount.fetch(
    credentialAccountKey
  );

  const decryptedCredential = await encryptor.decrypt(
    password,
    credentialAccountData.credentialData
  );

  return {
    credential: {
      credentialAddress: credentialAccountKey.toBase58(),
      ownerPrivateKeyEncoded: bs58.encode(keyPair.secretKey),
      uid: credentialPda.uid.toNumber(),
      salt: encryptor.passwordSalt,
      iv: encryptor.encryptionIv,
      ...decryptedCredential,
    },
    elapsedTime,
  };
}

function parseHrtimeToSeconds(hrtime: any) {
  const seconds = (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
  return seconds;
}

createCredentialProc();
