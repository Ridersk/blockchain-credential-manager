import browser from "webextension-polyfill";

let counter: number = 0;

export function setupAlarms() {
  // Create Alarms
  browser.runtime.onInstalled.addListener(() => {
    browser.alarms.create("refresh", { periodInMinutes: 0.1 });
  });

  // Listen alarms
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "refresh") {
      browser.action.setBadgeText({ text: String(counter++) });
    }
  });
}
