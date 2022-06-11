// Responsible to handle extension popup requests
chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action == "getCredentials") {
    // Password in a form
    const passwordElement = document.querySelector('input[type="password"]');
    // First input in a form that contains a password
    const labelElement = passwordElement.closest("form").querySelector("input");
    sendResponse({
      data: {
        password: passwordElement.value,
        label: labelElement.value
      }
    });
  } else sendResponse({});
});
