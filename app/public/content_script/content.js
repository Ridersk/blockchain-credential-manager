chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getCredentials")
    sendResponse({
      data: {
        // First input in a form that contains a password
        username: document.querySelector('input[type="password"]').closest("form").querySelector("input").value,
        // Password in a form
        password: document.querySelector('input[type="password"]').value
      }
    });
  else if (request.action == "getSelection") sendResponse({ data: window.getSelection().toString() });
  else if (request.action == "installHighlightedTextObserver") {
    document.onmouseup = () => {
      console.log("TEXTO SELECIONADO");
    };
    sendResponse({});
  } else if (request.action == "installInputObserver") {
    document.querySelector('input[type="password"]').onkeyup = (event) => {
      console.log(event.target.value);
    };
  } else sendResponse({}); // Send nothing..
});
