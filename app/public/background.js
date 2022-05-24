// Listener when extension icon is clicked. Only works when extension has no popup
chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, { action: "getSelection" }, function (response) {
    sendServiceRequest(response.data);
  });
});

chrome.tabs.onHighlighted.addListener(function (info) {
  const selectedTab = info.tabIds[0];
  chrome.tabs.sendMessage(selectedTab, { action: "installHighlightedTextObserver" }, function () {
    console.log(`INSTALLED HIGHLIGHTED ON TAB ${selectedTab}.`);
  });

  chrome.tabs.sendMessage(selectedTab, { action: "installInputObserver" }, function () {
    console.log(`INSTALLED PASSWORD OBSERVER ON TAB ${selectedTab}.`);
  });
});

function sendServiceRequest(selectedText) {
  const serviceCall = "http://www.google.com/search?q=" + selectedText;
  console.log("CRIANDO NOVA TAB:", serviceCall);
  chrome.tabs.create({ url: serviceCall });
}
