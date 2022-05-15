import * as anchor from "@project-serum/anchor";
import * as bs58 from "bs58";
import * as assert from "assert";
import * as bip39 from "bip39";
import * as ed from "ed25519-hd-key";

// describe("keypair-tests", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   it("testing convert private key", async () => {
//     const userKeyPair = anchor.web3.Keypair.generate();
//     const encodedPrivateKey = bs58.encode(userKeyPair.secretKey);
//     const generatedkeypairFromPrivate = anchor.web3.Keypair.fromSecretKey(
//       Uint8Array.from(bs58.decode(encodedPrivateKey))
//     );
//     const userPublicKey = userKeyPair.publicKey.toBase58();
//     const generatedPublicKey = generatedkeypairFromPrivate.publicKey.toBase58();

//     console.log("Public Key User:", userPublicKey);
//     console.log("Generated Public Key User:", generatedPublicKey);

//     assert.equal(userPublicKey, generatedPublicKey);
//   });

//   it("testing generate keypair from mnemonic", async () => {
//     const mnemonic = bip39.generateMnemonic();

//     console.log("MNEMONIC:", mnemonic);
//     console.log("Validate Mnemonic:", bip39.validateMnemonic(mnemonic));

//     bip39
//       .mnemonicToSeed(mnemonic)
//       .then((buffer) => {
//         const userKeyPair = anchor.web3.Keypair.fromSeed(
//           new Uint8Array(buffer.toJSON().data.slice(0, 32))
//         );
//         console.log("Complete Credentials:", userKeyPair);
//         console.log("Public Key converted:", userKeyPair.publicKey.toBase58());
//       })
//       .catch((err) => console.log("Erro Inesperado:", err));
//   });

//   it("testing generate keypair from mnemonic WITH DERIVED PATH", async () => {
//     // From derivation path it is possible generate 100 public keys
//     // Just increment from ../501'/0'/0' to /501'/9'/9' (Only some wallets use the derivation path)
//     const derivationPath = "m/44'/501'/0'/0'";

//     const mnemonic = bip39.generateMnemonic();

//     const seed = await bip39.mnemonicToSeed(mnemonic);
//     const derivedSeed = ed.derivePath(derivationPath, seed.toString("hex")).key;
//     const userKeyPair = anchor.web3.Keypair.fromSeed(derivedSeed);

//     console.log("MNEMONIC:", mnemonic);
//     console.log("Validate Mnemonic:", bip39.validateMnemonic(mnemonic));

//     console.log("Complete Credentials:", userKeyPair);
//     console.log("Public Key converted:", userKeyPair.publicKey.toBase58());
//   });
// });
