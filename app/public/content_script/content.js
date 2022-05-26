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
    document.querySelector('input[type="password"]')?.onkeyup = (event) => {
      console.log(event.target.value);
    };
  } else sendResponse({}); // Send nothing..
});

const interval = setInterval(() => {
  clearInterval(interval);
  // fetch(chrome.runtime.getURL("popup_credentials/index.html"))
  //   .then((result) => result.text())
  //   .then((html) => {
  //     document.querySelector('input[type="password"]').insertAdjacentHTML("beforebegin", html);
  //   });

  const passwordInput = document.querySelector('input[type="password"]');

  if (passwordInput) {
    const size = passwordInput.offsetHeight * 0.8;
  
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "bcm-credentials-container";
    buttonContainer.style.height = `${size}px`;
    buttonContainer.style.width = `${size}px`;
  
    const buttonImg = document.createElement("img");
    buttonImg.src = "https://cdn-icons-png.flaticon.com/512/2152/2152349.png";
  
    buttonContainer.appendChild(buttonImg);
    passwordInput.parentNode.insertBefore(buttonContainer, passwordInput);
  }
}, 100);
