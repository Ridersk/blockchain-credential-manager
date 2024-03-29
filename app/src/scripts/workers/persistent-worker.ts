let lifeline: chrome.runtime.Port | null;

export function setupPersistentWorker() {
  keepAlive();
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "keepAlive") {
      lifeline = port;
      setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
      port.onDisconnect.addListener(keepAliveForced);
    }
  });
}

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: "*://*/*" })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => chrome.runtime.connect({ name: "keepAlive" })
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(_tabId: any, info: any, _tab: any) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}
