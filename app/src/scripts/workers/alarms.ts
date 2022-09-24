let counter: number = 0;

export function setupAlarms() {
  // Create Alarms
  chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("refresh", { periodInMinutes: 0.1 });
  });

  // Listen alarms
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "refresh") {
      chrome.action.setBadgeText({ text: String(counter++) });
    }
  });
}
