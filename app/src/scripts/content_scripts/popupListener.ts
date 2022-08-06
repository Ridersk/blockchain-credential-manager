// Responsible to handle extension popup requests

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action == "getInputFormCredentials") {
    // Password in a form
    const passwordElement: HTMLInputElement = document.querySelector(
      'input[type="password"]'
    ) as HTMLInputElement;
    // First input in a form that contains a password
    const labelElement = passwordElement?.closest("form")?.querySelector("input");

    sendResponse({
      data: {
        label: labelElement?.value,
        password: passwordElement?.value
      }
    });
  } else sendResponse({});
});

export default {};