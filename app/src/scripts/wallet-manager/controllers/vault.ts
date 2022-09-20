import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  ParsedMessageAccount,
  Connection
} from "@solana/web3.js";
import base58 from "bs58";
import Logger from "../../../utils/log";
import { LedgerProgram } from "./ledger";

export class VaultAccountController {
  private _ledgerProgram: LedgerProgram<any>;
  private _accountAddress: PublicKey;
  private _connection: Connection;
  private _program: any;

  constructor(ledgerProgram: LedgerProgram<any>, keypair: Keypair) {
    this._ledgerProgram = ledgerProgram;
    this._accountAddress = keypair.publicKey;
    this._connection = this._ledgerProgram.connection;
    this._program = this._ledgerProgram.program;
  }

  async getVaultDetails() {
    let accountAdress: string = "";
    let balance: number = 0;

    const accountInfo = await this._connection.getAccountInfo(this._accountAddress);
    accountAdress = this._accountAddress.toBase58();
    balance = (accountInfo?.lamports || 0) / LAMPORTS_PER_SOL;

    return { address: accountAdress, balance };
  }

  async getActivities() {
    let activities: VaultActivity[] = [];

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
      } catch (error) {
        Logger.error(error);
        try {
          const programInstruction = transactionMessage?.instructions[0] as ParsedInstruction;
          const instructionParsedData = programInstruction.parsed;

          transactionType =
            InstructionTypeCode[instructionParsedData.type as keyof typeof InstructionTypeCode];
          fromAddress = instructionParsedData.info.source;
          toAddress = instructionParsedData.info.destination;
          extraParams = { solAmount: instructionParsedData.info.lamports / LAMPORTS_PER_SOL };
        } catch (error) {
          Logger.error(error);
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

    return activities;
  }

  async requestAirdrop() {
    // Request airdrop of 1 SOL
    const signature = await this._connection.requestAirdrop(this._accountAddress, 1000000000);
    await this._ledgerProgram.confirmTransaction(signature);
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
