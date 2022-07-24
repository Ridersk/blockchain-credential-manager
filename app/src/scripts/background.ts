import { VaultIncorrectPasswordError, VaultLockedError } from "../exceptions";
import { VaultManager, initVaultManager } from "./wallet-manager/wallet-manager";

let vaultManager: VaultManager;

async function setupVault() {
  vaultManager = await initVaultManager();
  // await vaultManager.unlockVault(await getPasswordFromBackground());
}

setupVault();

/*
 * Old functions
 */

let counter: number = 0;

// Create Alarm
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("refresh", { periodInMinutes: 0.1 });
  console.log("Alarm 'refresh' installed.");
});

// Listen for alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "refresh") {
    const session = await chrome.storage.session.get("currPassword");
    console.log("Counter:", counter++, "Current Password:", session.currPassword);
    chrome.action.setBadgeText({ text: String(counter) });
  }
});

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  messageHandler(request).then(sendResponse);
  return true;
});

// let currPassword: string;
async function messageHandler(request: any) {
  if (request.action === "registerWallet") {
    const keypair = await vaultManager.registerNewWallet(
      request.data.mnemonic,
      request.data.password
    );
    return { data: { publicKey: keypair?.publicKey?.toBase58() } };
  } else if (request.action === "unlockVault") {
    const password = request.data.password;
    await vaultManager.unlockVault(password);
    return {
      data: {
        unlocked: true
      }
    };
  } else if (request.action === "getCurrentWallet") {
    let status;
    let keypair;
    try {
      keypair = await vaultManager.getCurrentAccountKeypair();
      status = "UNLOCKED";
    } catch (err) {
      if (err instanceof VaultLockedError || err instanceof VaultIncorrectPasswordError) {
        status = "LOCKED";
      } else {
        status = "NOT_FOUND";
      }
    }

    return {
      data: {
        publicKey: keypair?.publicKey?.toBase58(),
        status
      }
    };
  } else if (request.action === "encryptData") {
    const data = request.data;
    const encryptedData = await vaultManager.encryptMessage(data);
    return {
      data: encryptedData
    };
  } else if (request.action === "decryptData") {
    const data = request.data;
    const decryptedData = await vaultManager.decryptMessage(data);
    return {
      data: decryptedData
    };
  } else if (request.action === "getWalletSigner") {
    const walletSigner = await vaultManager.getCurrentWalletSigner();
    console.log("[BACKGROUND] Wallet Signer:", walletSigner);
    return {
      data: {
        walletSigner
      }
    };
  } else return {};
}
