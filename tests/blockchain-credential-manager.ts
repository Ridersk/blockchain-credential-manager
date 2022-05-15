import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BlockchainCredentialManager } from "../target/types/blockchain_credential_manager";

describe("blockchain-credential-manager", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .BlockchainCredentialManager as Program<BlockchainCredentialManager>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
