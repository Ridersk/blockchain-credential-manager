import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { EncryptionUtils } from "./utils/aes-encryption";
import { initializeProgram } from "./utils/testing-utils";

const argv = require("minimist")(process.argv.slice(2));

async function editCredentialProc() {
  try {
    const credentialData = JSON.parse(argv.credentialData);
    const { program, keyPair } = initializeProgram(
      Keypair.fromSecretKey(bs58.decode(credentialData.ownerPrivateKeyEncoded))
    );
    const password = "00000000";
    const encryptor = new EncryptionUtils(
      credentialData.salt,
      credentialData.iv
    );
    const encryptedCredentialData = await encryptor.encrypt(password, {
      title: credentialData.title,
      url: credentialData.url,
      label: credentialData.label,
      secret: credentialData.secret,
      description: credentialData.description,
    });

    const startTime = process.hrtime();
    await program.methods
      .editCredential(
        new anchor.BN(credentialData.uid),
        encryptedCredentialData,
        encryptor.encryptionIv,
        encryptor.passwordSalt
      )
      .accounts({
        credentialAccount: credentialData.credentialAddress,
        owner: keyPair.publicKey,
      })
      .rpc();
    const elapsedTime = parseHrtimeToSeconds(process.hrtime(startTime));

    process.stdout.write(
      JSON.stringify({ credential: credentialData, elapsedTime })
    );
    process.exitCode = 0;
  } catch (error) {
    process.exitCode = 1;
    console.log(error);
  }
}

function parseHrtimeToSeconds(hrtime: any) {
  const seconds = (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
  return seconds;
}

editCredentialProc();
