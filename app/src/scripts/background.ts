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

async function messageHandler(request: { action: string; data: any[] }) {
  let status: "success" | "error" = "success";
  let result;
  let error;

  try {
    // @ts-ignore: Unreachable code error
    const walletManagerApiMethod = walletManager.api[request.action];
    if (walletManagerApiMethod) {
      if (typeof walletManagerApiMethod === "function") {
        // @ts-ignore: Unreachable code error
        result = await walletManagerApiMethod(...request.data);
      }
    } else {
      throw new Error(`Action ${request.action} not found`);
    }
  } catch (error) {
    console.error("[Background]:", error);
    if (error instanceof Error) {
      error = error.message;
    }
    status = "error";
  }

  return { status, result, error };
}

export type BackgroundResponse<T> = {
  status: "success" | "error";
  result: T;
  error: any;
};

export type InferBackgroundAPI<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => infer R
  ? (...args: P) => Promise<BackgroundResponse<Awaited<R>>>
  : never;

export type BackgroundAPI = {
  [K in keyof typeof walletManager.api]: InferBackgroundAPI<typeof walletManager.api[K]>;
};
