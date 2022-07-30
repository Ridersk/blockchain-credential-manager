import { VaultManager, initVaultManager } from "./wallet-manager/wallet-manager";

let vaultManager: VaultManager;

async function setupVault() {
  vaultManager = await initVaultManager();
}

setupVault();

/*
 * Old functions
 */

let counter: number = 0;

// Create Alarm
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("refresh", { periodInMinutes: 0.1 });
});

// Listen for alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "refresh") {
    chrome.action.setBadgeText({ text: String(counter++) });
  }
});

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  messageHandler(request).then(sendResponse);
  return true;
});

async function messageHandler(request: any) {
  if (request.action === "registerWallet") {
    const keypair = await vaultManager.registerNewWallet(
      request.data.mnemonic,
      request.data.password
    );
    return { data: { publicKey: keypair?.publicKey?.toBase58() } };
  } else if (request.action === "unlockVault") {
    let isUnlocked = false;
    try {
      isUnlocked = await vaultManager.unlockVault(request.data.password);
    } catch (err) {
      console.log("[Background]", err);
    }

    return {
      data: {
        isUnlocked: isUnlocked
      }
    };
  } else if (request.action === "getState") {
    const state = await vaultManager.getState();
    return { data: state };
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
  } else return {};
}
