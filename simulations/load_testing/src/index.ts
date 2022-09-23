import childProcess from "child_process";
import * as async from "async";

require("dotenv").config();

const CONCURRENCY = parseInt(process.env.CONCURRENCY!);
const RUNS_COUNT = parseInt(process.env.RUNS_COUNT!);
const CREDENTIALS_COUNT = parseInt(process.env.CREDENTIALS_COUNT!);

async function main() {
  try {
    const data = await prepareTest();
    const firstCredential = data.credentialsData[0].credential;
    console.log(`CREDENTIALS: ${JSON.stringify(data, null, 2)}`);
    await runMeasurableProcess(
      "Edit Credential",
      "./src/editCredential.ts",
      firstCredential
    );
    await runMeasurableProcess(
      "Get Credential",
      "./src/getCredential.ts",
      firstCredential
    );
    await runMeasurableProcess(
      "Get Credentials List",
      "./src/getCredentials.ts",
      firstCredential
    );
  } catch (e) {
    console.log(e);
  }
}

async function prepareTest(): Promise<{ [key: string]: any }> {
  console.log(
    `=========================== Test Configuration ===========================`
  );
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(`Runs count: ${RUNS_COUNT}`);
  console.log(`Credentials count: ${CREDENTIALS_COUNT}`);

  console.log(
    `=========================== Test Preparation - Create credentials ===========================`
  );

  let child = childProcess.spawn("ts-node", [
    "./src/createCredential.ts",
    `--credentialsCount=${CREDENTIALS_COUNT}`,
  ]);

  const data = await new Promise((resolve, reject) => {
    let credentialData: { [key: string]: any };
    child.stdout.on("data", (data) => {
      try {
        credentialData = JSON.parse(data);
      } catch (e) {
        console.log(`createCredentials STDOUT: ${data}`);
      }
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(credentialData);
      } else {
        reject("Error on create Credential");
      }
    });
  });

  return data as { [key: string]: any };
}

async function runMeasurableProcess(
  processName: string,
  path: string,
  credentialData: { [key: string]: string }
) {
  let times: number[] = [];
  let responses: boolean[] = [];

  console.log(
    `=========================== STEP - ${processName} ===========================`
  );

  await new Promise((resolve, reject) => {
    async.eachLimit(
      repeatableGenetaor(JSON.stringify(credentialData), RUNS_COUNT),
      CONCURRENCY,
      function (credential, callback) {
        let child = childProcess.spawn("ts-node", [
          path,
          `--credentialData=${credential}`,
        ]);

        child.stdout.on("data", (data) => {
          try {
            times.push(parseFloat(JSON.parse(data).elapsedTime));
          } catch (e) {
            console.log(`child error: ${data}`);
          }
        });

        child.on("exit", (code) => {
          if (code === 0) {
            responses.push(true);
          } else {
            responses.push(false);
          }

          process.stdout.write(`completed runs: ${times.length}\r`);
          callback();
        });
      },
      function (error) {
        console.log();
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      }
    );
  });

  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  console.log(`average: ${avg}`);

  if (responses.filter(Boolean).length == responses.length) {
    console.log("success!");
  } else {
    console.log("fail!");
  }
}

main();

function* repeatableGenetaor(value: any, end: number, step: number = 1) {
  let index = 0;

  while (index < end) {
    yield value;
    index += step;
  }
}
