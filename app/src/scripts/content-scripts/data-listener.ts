// Responsible to get credential values from current page form inputs
import browser from "webextension-polyfill";
import { getCredentialsInputs } from "./selectCredentialsInput";

browser.runtime.onMessage.addListener(async function (request, _sender) {
  if (request.action == "getInputFormCredentials") {
    const { labelInput, passwordInput } = getCredentialsInputs();

    return {
      data: {
        label: labelInput?.value,
        password: passwordInput?.value
      }
    };
  } else return {};
});

export default {};
