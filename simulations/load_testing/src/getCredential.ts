import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { EncryptionUtils } from "./utils/aes-encryption";
import { initializeProgram } from "./utils/testing-utils";

const argv = require("minimist")(process.argv.slice(2));

async function getCredentialProc() {
  try {
    const credentialData = JSON.parse(argv.credentialData);
    const { program } = initializeProgram(
      Keypair.fromSecretKey(bs58.decode(credentialData.ownerPrivateKeyEncoded))
    );

    const credentialAddress = credentialData.credentialAddress;

    const startTime = process.hrtime();
    const credentialAccountData = await program.account.credentialAccount.fetch(
      credentialAddress
    );
    const elapsedTime = parseHrtimeToSeconds(process.hrtime(startTime));

    const encryptor = new EncryptionUtils(
      credentialAccountData.salt,
      credentialAccountData.iv
    );
    const password = "00000000";
    const decryptedCredential = await encryptor.decrypt(
      password,
      credentialAccountData.credentialData
    );

    process.stdout.write(
      JSON.stringify({ credential: decryptedCredential, elapsedTime })
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

getCredentialProc();
