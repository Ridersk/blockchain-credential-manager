import Logger from "../../utils/log";
import { WalletManager, initVaultManager } from "../wallet-manager";

let walletManager: WalletManager;

export async function setupVault() {
  walletManager = await initVaultManager();

  chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
    messageHandler(request).then(sendResponse);
    return true;
  });
}

async function messageHandler(request: { action: string; data: any[] }) {
  let status: "success" | "error" = "success";
  let result;
  let errorMsg;

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
    Logger.error("[Background]:", error);
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    status = "error";
  }

  return { status, result, error: errorMsg };
}

type BackgroundResponse<T> = {
  status: "success" | "error";
  result: T;
  error: any;
};

type InferWalletAPI<T extends (...args: any) => any> = T extends (...args: infer P) => infer R
  ? (...args: P) => Promise<BackgroundResponse<Awaited<R>>>
  : never;

export type WalletAPI = {
  [K in keyof typeof walletManager.api]: InferWalletAPI<typeof walletManager.api[K]>;
};
