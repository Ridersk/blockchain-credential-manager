function installButton() {
  const BUTTON_ID = "bcm-credentials-container";

  if (!document.getElementById(BUTTON_ID)) {
    try {
      const passwordInput: HTMLInputElement = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      const labelInput: HTMLInputElement = passwordInput
        ?.closest("form")
        ?.querySelector("input") as HTMLInputElement;

      if (passwordInput) {
        const size = passwordInput?.offsetHeight * 0.8;

        const buttonContainer = document.createElement("div");
        buttonContainer.id = BUTTON_ID;
        buttonContainer.style.height = `${size}px`;
        buttonContainer.style.width = `${size}px`;

        const buttonImg = document.createElement("img");
        buttonImg.src = "https://cdn-icons-png.flaticon.com/512/2152/2152349.png";

        buttonContainer.appendChild(buttonImg);

        passwordInput?.parentNode?.insertBefore(buttonContainer.cloneNode(true), passwordInput);
        labelInput?.parentNode?.insertBefore(buttonContainer.cloneNode(true), labelInput);
      }
    } catch (e) {}
    console.log("Button Installed!");
  }
}

export const interval = setInterval(() => {
  clearInterval(interval);
  const observerConfig = { attributes: true, childList: true };
  const targetNode: HTMLBodyElement = document.querySelector("body")!;

  const observer = new MutationObserver(installButton);
  observer.observe(targetNode, observerConfig);
}, 500);
