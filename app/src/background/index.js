let counter = 0;
let currPassword;

// Create Alarm
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("refresh", { periodInMinutes: 0.1 });
  console.log("Alarm 'refresh' installed.");
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refresh") {
    console.log("Counter:", counter++, "Current Password:", currPassword);
  }
});

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action == "savePassword") {
    // Password in a form
    currPassword = request.data.password;
    console.log("Saving...", currPassword);
    sendResponse({
      data: {
        password: currPassword
      }
    });
  } else if (request.action == "getPassword") {
    console.log("Retrieving...", currPassword);
    sendResponse({
      data: {
        password: currPassword
      }
    });
  } else sendResponse({});
});
