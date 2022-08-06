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
    let isUnlocked = await vaultManager.unlockVault(request.data.password);
    return {
      data: {
        isUnlocked: isUnlocked
      }
    };
  } else if (request.action === "getState") {
    const state = await vaultManager.getState();
    return { data: state };
  } else if (request.action === "createCredential") {
    const credentialData = request.data;
    const response = await vaultManager.credentialsController?.createCredential(credentialData);
    return {
      data: response
    };
  } else if (request.action === "credentials.edit") {
    const credentialData = request.data;
    const response = await vaultManager.credentialsController?.editCredential(credentialData);
    return {
      data: response
    };
  } else if (request.action === "credentials.get") {
    const address = request?.data?.address;
    const credential = await vaultManager.credentialsController?.getCredential(address);
    return {
      data: { credential }
    };
  } else if (request.action === "credentials.getList") {
    const credentialsController = vaultManager.credentialsController;
    const credentials = await credentialsController?.getCredentials();
    return {
      data: {
        credentials
      }
    };
  } else if (request.action === "credentials.delete") {
    const address = request?.data?.address;
    const response = await vaultManager.credentialsController?.deleteCredential(address);
    return {
      data: response
    };
  } else if (request.action === "account.details") {
    const response = await vaultManager.accountController?.getWalletDetails();
    return {
      data: response
    };
  } else if (request.action === "account.activities") {
    const response = await vaultManager.accountController?.getActivities();
    return {
      data: response
    };
  } else if (request.action === "account.requestAirdrop") {
    const response = await vaultManager.accountController?.requestAirdrop();
    return {
      data: response
    };
  }
}
