import { WalletManager, initVaultManager } from "./wallet-manager/wallet-manager";

let walletManager: WalletManager;

async function setupVault() {
  walletManager = await initVaultManager();
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
  if (request.action === "wallet.registerWallet") {
    const keypair = await walletManager.registerNewWallet(
      request.data.mnemonic,
      request.data.password,
      request.data.firstVaultAccount
    );
    return { data: { publicKey: keypair?.address } };
  } else if (request.action === "wallet.unlockWallet") {
    let isUnlocked = await walletManager.unlockWallet(request.data.password);
    return {
      data: {
        isUnlocked: isUnlocked
      }
    };
  } else if (request.action === "wallet.getState") {
    const state = await walletManager.getState();
    return { data: state };
  } else if (request.action === "credentials.create") {
    const credentialData = request.data;
    const response = await walletManager.credentialsController?.createCredential(credentialData);
    return {
      data: response
    };
  } else if (request.action === "credentials.edit") {
    const credentialData = request.data;
    const response = await walletManager.credentialsController?.editCredential(credentialData);
    return {
      data: response
    };
  } else if (request.action === "credentials.get") {
    const address = request?.data?.address;
    const credential = await walletManager.credentialsController?.getCredential(address);
    return {
      data: { credential }
    };
  } else if (request.action === "credentials.getList") {
    const credentialsController = walletManager.credentialsController;
    const credentials = await credentialsController?.getCredentials();
    return {
      data: {
        credentials
      }
    };
  } else if (request.action === "credentials.delete") {
    const address = request?.data?.address;
    const response = await walletManager.credentialsController?.deleteCredential(address);
    return {
      data: response
    };
  } else if (request.action === "vault.details") {
    const response = await walletManager.vaultAccountController?.getVaultDetails();
    return {
      data: response
    };
  } else if (request.action === "vault.activities") {
    const response = await walletManager.vaultAccountController?.getActivities();
    return {
      data: response
    };
  } else if (request.action === "vault.requestAirdrop") {
    const response = await walletManager.vaultAccountController?.requestAirdrop();
    return {
      data: response
    };
  }
}
