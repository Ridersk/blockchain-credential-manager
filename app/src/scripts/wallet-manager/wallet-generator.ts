import { generateMnemonic, mnemonicToSeed } from "bip39";
import { Keypair } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";

export class WalletGenerator {
  static generateMnemonic(): string {
    return generateMnemonic();
  }

  static async generateWalletKeypair(mnemonic: string): Promise<Keypair> {
    const seed = await mnemonicToSeed(mnemonic);
    return web3.Keypair.fromSeed(new Uint8Array(seed.toJSON().data.slice(0, 32)));
  }
}
