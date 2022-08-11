import { BackgroundAPI } from "scripts/background";

const proxyHandler = {
  get: (_target: object, property: string | symbol, _receiver: any) => {
    return async (...params: any[]) => {
      return chrome.runtime.sendMessage({ action: property, data: params });
    };
  }
};

const backgroundConnection: BackgroundAPI = new Proxy({}, proxyHandler) as unknown as BackgroundAPI;

export let background: BackgroundAPI;
function _setBackgroundConnection(backgroundConnectionPort: BackgroundAPI) {
  background = backgroundConnectionPort;
}
_setBackgroundConnection(backgroundConnection);
