export {};

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
  if (request.action == "savePassword") {
    await chrome.storage.session.set({ currPassword: request.data.password });

    return {
      data: {
        password: request.data.password
      }
    };
  } else if (request.action == "getPassword") {
    const session = await chrome.storage.session.get("currPassword");
    console.log("Retrieving...", session.currPassword);

    return {
      data: {
        password: session.currPassword
      }
    };
  } else return {};
}
