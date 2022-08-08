import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const CLUSTER_URL = "http://127.0.0.1:8899" || "devnet";
const COMMITMENT = "confirmed";

export class AccountUtils {
  connection: Connection;

  constructor() {
    this.connection = new Connection(CLUSTER_URL, COMMITMENT);
  }

  async getAccountBalance(address: string): Promise<number> {
    let balance: number = 0;

    try {
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(address));
      balance = (accountInfo?.lamports || 0) / LAMPORTS_PER_SOL;
    } catch (err) {}

    return balance;
  }
}
