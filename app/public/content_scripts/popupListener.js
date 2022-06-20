// Responsible to handle extension popup requests
chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action == "getCredentials") {
    // Password in a form
    const passwordElement = document.querySelector('input[type="password"]');
    // First input in a form that contains a password
    const labelElement = passwordElement.closest("form").querySelector("input");

    console.log("CONTENT URL:", window.location.href);
    console.log("CONTENT SCRIPT FAVICON:", document.querySelector("head > link[rel$='icon']")?.href);

    sendResponse({
      data: {
        label: labelElement.value,
        password: passwordElement.value
      }
    });
  } else sendResponse({});
});
