import { WalletAPI } from "scripts/workers/vault";

const proxyHandler = {
  get: (_target: object, property: string | symbol, _receiver: any) => {
    return async (...params: any[]) => {
      return chrome.runtime.sendMessage({ action: property, data: params });
    };
  }
};

const backgroundConnection: WalletAPI = new Proxy({}, proxyHandler) as unknown as WalletAPI;

export let background: WalletAPI;
function _setBackgroundConnection(backgroundConnectionPort: WalletAPI) {
  background = backgroundConnectionPort;
}
_setBackgroundConnection(backgroundConnection);
