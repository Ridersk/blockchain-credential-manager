import {
  ParsedInstruction,
  PartiallyDecodedInstruction,
  ParsedMessageAccount,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import base58 from "bs58";
import workspace, { SolanaWeb3Workspace } from "../solana/solanaWeb3";

enum InstructionTypeCode {
  "cd4a3cd43fc6c46d" = "CREATE_CREDENTIAL",
  "73944ac1a7630538" = "EDIT_CREDENTIAL",
  "14d808e274e4c10c" = "DELETE_CREDENTIAL",
  "transfer" = "TRANSFER",
  "success" = "SUCCESS",
  "error" = "ERROR"
}

type TransactionStatus = "success" | "received" | "error";
type TransactionDirection = "input" | "output";

export type Activity = {
  txSignature: string;
  status: TransactionStatus;
  type: InstructionTypeCode;
  direction: TransactionDirection;
  fromAddress?: string | null;
  toAddress?: string | null;
  extraParams?: object;
};

const getActivities = async (): Promise<Activity[]> => {
  const { connection, userKeypair, program } = workspace() as SolanaWeb3Workspace;
  const signatures = await connection.getSignaturesForAddress(userKeypair.publicKey);
  const transactions = await program.provider.connection.getParsedTransactions(
    signatures.map((signature) => signature.signature)
  );

  let activities: Activity[] = [];
  for (const index in transactions) {
    const transactionMessage = transactions[index]?.transaction.message;
    const transactionSignature = transactions[index]?.transaction.signatures[0] as string;
    const accounts = transactionMessage?.accountKeys as ParsedMessageAccount[];
    const transactionError = transactions[index]?.meta?.err;
    let transactionType;
    let status: TransactionStatus;
    let direction: TransactionDirection;
    let fromAddress: string | null = null;
    let toAddress: string | null = null;
    let extraParams;

    try {
      const programInstruction = transactionMessage?.instructions[0] as PartiallyDecodedInstruction;
      const instructionData = programInstruction.data;

      convertB58ToPrettyHex(programInstruction.data);
      transactionType =
        InstructionTypeCode[
          convertB58ToPrettyHex(instructionData).substring(
            0,
            16
          ) as keyof typeof InstructionTypeCode
        ];
      fromAddress = accounts[0].pubkey.toBase58();
      toAddress = accounts[1].pubkey.toBase58();
      status = transactionError ? "error" : "success";
      direction = "output";
    } catch (err) {
      try {
        const programInstruction = transactionMessage?.instructions[0] as ParsedInstruction;
        const instructionParsedData = programInstruction.parsed;

        transactionType =
          InstructionTypeCode[instructionParsedData.type as keyof typeof InstructionTypeCode];
        fromAddress = instructionParsedData.info.source;
        toAddress = instructionParsedData.info.destination;
        extraParams = { solAmount: instructionParsedData.info.lamports / LAMPORTS_PER_SOL };
      } catch (error) {
        transactionType = !transactionError
          ? InstructionTypeCode.success
          : InstructionTypeCode.error;
      } finally {
        direction = "input";
        status = transactionError ? "error" : "received";
      }
    }

    activities.push({
      txSignature: transactionSignature,
      status: status,
      type: transactionType,
      direction,
      toAddress,
      fromAddress,
      extraParams
    });
  }

  return activities;
};

function convertB58ToPrettyHex(b58Text: string): string {
  return Buffer.from(base58.decode(b58Text)).toString("hex");
  // .replace(/(.{2})/g, "$1 ");
}

export default getActivities;
