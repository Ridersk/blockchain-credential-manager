import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { ownerFilter } from "./utils/ledger-filters";
import { initializeProgram } from "./utils/testing-utils";

const argv = require("minimist")(process.argv.slice(2));

async function getCredentialProc() {
  try {
    const credentialData = JSON.parse(argv.credentialData);
    const { program, keyPair } = initializeProgram(
      Keypair.fromSecretKey(bs58.decode(credentialData.ownerPrivateKeyEncoded))
    );

    const startTime = process.hrtime();
    const credentials = await program.account.credentialAccount.all([
      ownerFilter(keyPair.publicKey.toBase58()),
    ]);
    const elapsedTime = parseHrtimeToSeconds(process.hrtime(startTime));

    process.stdout.write(
      JSON.stringify({ credentialsAmount: credentials.length, elapsedTime })
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
