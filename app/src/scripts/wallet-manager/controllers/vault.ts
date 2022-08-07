import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  ParsedMessageAccount
} from "@solana/web3.js";
import base58 from "bs58";
import { sleep } from "../../../utils/time";
import { LedgerProgram } from "./ledger";

export class VaultAccountController {
  private _ledgerProgram: LedgerProgram<any>;
  private _accountAddress: PublicKey;
  private _connection: import("@solana/web3.js").Connection;
  private _program: any;

  constructor(ledgerProgram: LedgerProgram<any>, keypair: Keypair) {
    this._ledgerProgram = ledgerProgram;
    this._accountAddress = keypair.publicKey;
    this._connection = this._ledgerProgram.connection;
    this._program = this._ledgerProgram.program;
  }

  async getVaultDetails() {
    let status = "success";
    let accountAdress: string = "";
    let balance: number = 0;

    try {
      const accountInfo = await this._connection.getAccountInfo(this._accountAddress);
      accountAdress = this._accountAddress.toBase58();
      balance = (accountInfo?.lamports || 0) / LAMPORTS_PER_SOL;
    } catch (err) {
      status = "error";
    }

    return { status, details: { address: accountAdress, balance } };
  }

  async getActivities() {
    let status = "success";
    let activities: VaultActivity[] = [];

    try {
      const signatures = await this._connection.getSignaturesForAddress(this._accountAddress);
      const transactions = await this._program.provider.connection.getParsedTransactions(
        signatures.map((signature) => signature.signature)
      );

      for (const index in transactions) {
        const transactionMessage = transactions[index]?.transaction.message;
        const transactionSignature = transactions[index]?.transaction.signatures[0] as string;
        const accounts = transactionMessage?.accountKeys as ParsedMessageAccount[];
        const transactionError = transactions[index]?.meta?.err;
        let transactionType;
        let txStatus: TransactionStatus;
        let direction: TransactionDirection;
        let fromAddress: string | null = null;
        let toAddress: string | null = null;
        let extraParams;

        try {
          const programInstruction = transactionMessage
            ?.instructions[0] as PartiallyDecodedInstruction;
          const instructionData = programInstruction.data;

          this._convertB58ToPrettyHex(programInstruction.data);
          transactionType =
            InstructionTypeCode[
              this._convertB58ToPrettyHex(instructionData).substring(
                0,
                16
              ) as keyof typeof InstructionTypeCode
            ];
          fromAddress = accounts[0].pubkey.toBase58();
          toAddress = accounts[1].pubkey.toBase58();
          txStatus = transactionError ? "error" : "success";
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
            txStatus = transactionError ? "error" : "received";
          }
        }

        activities.push({
          txSignature: transactionSignature,
          status: txStatus,
          type: transactionType,
          direction,
          toAddress,
          fromAddress,
          extraParams
        });
      }
    } catch (err) {
      status = "error";
    }

    return { status, activities };
  }

  async requestAirdrop() {
    // Request airdrop of 1 SOL
    let status = "success";
    try {
      const airdropSignature = await this._connection.requestAirdrop(
        this._accountAddress,
        1000000000
      );
      await this._connection.confirmTransaction(airdropSignature);
    } catch (err) {
      status = "error";
    }

    await sleep(1000);

    return {
      status
    };
  }

  _convertB58ToPrettyHex(b58Text: string): string {
    return Buffer.from(base58.decode(b58Text)).toString("hex");
  }
}

export type VaultAccountDetails = {
  address: string;
  balance: number;
};

type TransactionStatus = "success" | "received" | "error";
type TransactionDirection = "input" | "output";

enum InstructionTypeCode {
  "cd4a3cd43fc6c46d" = "CREATE_CREDENTIAL",
  "73944ac1a7630538" = "EDIT_CREDENTIAL",
  "14d808e274e4c10c" = "DELETE_CREDENTIAL",
  "transfer" = "TRANSFER",
  "success" = "SUCCESS",
  "error" = "ERROR"
}

export type VaultActivity = {
  txSignature: string;
  status: TransactionStatus;
  type: InstructionTypeCode;
  direction: TransactionDirection;
  fromAddress?: string | null;
  toAddress?: string | null;
  extraParams?: object;
};
