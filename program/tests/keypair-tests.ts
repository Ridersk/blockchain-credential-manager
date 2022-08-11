import * as anchor from "@project-serum/anchor";
import * as bs58 from "bs58";
import * as assert from "assert";
import * as bip39 from "bip39";
import * as ed from "ed25519-hd-key";

describe("keypair-tests", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  it("testing convert private key", async () => {
    const userKeyPair = anchor.web3.Keypair.generate();
    const encodedPrivateKey = bs58.encode(userKeyPair.secretKey);
    const generatedkeypairFromPrivate = anchor.web3.Keypair.fromSecretKey(
      Uint8Array.from(bs58.decode(encodedPrivateKey))
    );

    assert.equal(
      userKeyPair.publicKey.toBase58(),
      generatedkeypairFromPrivate.publicKey.toBase58()
    );
    assert.equal(
      userKeyPair.secretKey.toString(),
      generatedkeypairFromPrivate.secretKey.toString()
    );
  });

  it("testing generate keypair from mnemonic", async () => {
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const userKeyPair = anchor.web3.Keypair.fromSeed(
      new Uint8Array(seed.toJSON().data.slice(0, 32))
    );

    assert.ok(bip39.validateMnemonic(mnemonic));
    assert.ok(userKeyPair.publicKey.toBase58());
    assert.ok(bs58.encode(userKeyPair.secretKey));
  });

  it("testing generate keypair from mnemonic WITH DERIVED PATH", async () => {
    // From derivation path it is possible generate 100 public keys
    // Just increment from ../501'/0'/0' to /501'/9'/9' (Only some wallets use the derivation path)
    const derivationPath = "m/44'/501'/0'/0'";
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);

    const derivedSeed = ed.derivePath(derivationPath, seed.toString("hex")).key;
    const userKeyPair = anchor.web3.Keypair.fromSeed(derivedSeed);

    assert.ok(bip39.validateMnemonic(mnemonic));
    assert.ok(userKeyPair.publicKey.toBase58());
    assert.ok(bs58.encode(userKeyPair.secretKey));
  });
});
