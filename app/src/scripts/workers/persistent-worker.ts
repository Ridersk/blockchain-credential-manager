import browser from "webextension-polyfill";

let lifeline: browser.Runtime.Port | null;

export function setupPersistentWorker() {
  keepAlive();
  browser.runtime.onConnect.addListener((port) => {
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
  // browser.tabs.executeScript({ file: "./browser-polyfill.js" });

  for (const tab of await browser.tabs.query({ url: "*://*/*" })) {
    try {
      await browser.scripting.executeScript({
        target: { tabId: tab.id! },
        func: connectToServiceWorker
        // `function` will become `func` in Chrome 93+
      });
      browser.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  browser.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(_tabId: any, info: any, _tab: any) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}

function connectToServiceWorker() {
  if (isChrome()) {
    // Chrome 93+ supports `browser.runtime.connect` in content scripts
    chrome.runtime.connect({ name: "keepAlive" });
  } else {
    browser.runtime.connect({ name: "keepAlive" });
  }

  function isChrome() {
    return detectBrowser() === "chrome";
  }

  function detectBrowser() {
    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "edge";
    }

    return browserName;
  }
}
