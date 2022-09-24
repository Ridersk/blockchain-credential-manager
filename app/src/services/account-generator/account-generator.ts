import { generateMnemonic, mnemonicToSeed, validateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import * as ed from "ed25519-hd-key";

export class AccountGenerator {
  static generateMnemonic(): string {
    return generateMnemonic();
  }

  static validateMnemonic(mnemonic: string): boolean {
    return validateMnemonic(mnemonic);
  }

  static async generateAccountList(mnemonic: string): Promise<Keypair[]> {
    const accountList = [];
    const seed = (await mnemonicToSeed(mnemonic)).toString("hex");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const derivedSeed = ed.derivePath(`m/44'/501'/${i}'/${j}'`, seed).key;

        accountList.push(web3.Keypair.fromSeed(derivedSeed));
      }
    }

    return accountList;
  }
}
