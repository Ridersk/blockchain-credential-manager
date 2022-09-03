// Responsible to get credential values from current page

import { getCredentialsInputs } from "./selectCredentialsInput";

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action == "getInputFormCredentials") {
    const { labelInput, passwordInput } = getCredentialsInputs();

    sendResponse({
      data: {
        label: labelInput?.value,
        password: passwordInput?.value
      }
    });
  } else sendResponse({});
});

export default {};
