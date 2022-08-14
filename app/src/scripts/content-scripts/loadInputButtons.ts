import { getCredentialsInputs } from "./selectCredentialsInput";

const BUTTON_ID = "bcm-toggle-popup-btn";
const INPAGE_POPUP_ID = "bcm-popup";
const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 290;
const DIFF_CONTENT_WRAPPER = 20;

function installButton() {
  if (!document.getElementById(BUTTON_ID)) {
    try {
      const { labelInput, passwordInput } = getCredentialsInputs();

      if (passwordInput) {
        const size = passwordInput?.offsetHeight * 0.8;

        const buttonContainer = document.createElement("div");
        buttonContainer.id = BUTTON_ID;
        buttonContainer.style.height = `${size}px`;
        buttonContainer.style.width = `${size}px`;

        const buttonImg = document.createElement("img");
        buttonImg.src = chrome.runtime.getURL("assets/action-btn.png");
        buttonContainer.appendChild(buttonImg);

        passwordInput?.parentNode?.insertBefore(
          buttonContainer.cloneNode(true),
          passwordInput.nextSibling
        );
        labelInput?.parentNode?.insertBefore(
          buttonContainer.cloneNode(true),
          labelInput.nextSibling
        );

        const btnsAction: NodeListOf<HTMLElement> = document?.querySelectorAll(`#${BUTTON_ID}`);
        for (let btn of btnsAction) {
          btn.onclick = async (event) => {
            event.stopPropagation();
            const btnPos = btn.getBoundingClientRect();
            const btnPoX = btnPos.x + window.scrollX;
            const btnPosY = btnPos.top + window.scrollY;
            await toggleInPagePopup(btnPoX + btnPos.width / 2, btnPosY + btnPos.height);
          };
        }
      }
    } catch (err) {}
  }
}

async function toggleInPagePopup(targetPosX: number, targetPosY: number) {
  if (!document.querySelector(`iframe#${INPAGE_POPUP_ID}`)) {
    const iframe = document.createElement("iframe");
    iframe.id = INPAGE_POPUP_ID;
    iframe.src = chrome.runtime.getURL("popup_credentials/index.html");
    iframe.style.overflow = "hidden";
    iframe.style.position = "absolute";
    iframe.style.display = "block";
    iframe.style.zIndex = "99999999";
    iframe.style.backgroundColor = "transparent";
    iframe.style.visibility = "visible";
    iframe.style.border = "none";
    iframe.style.borderTopWidth = "0px";
    iframe.style.borderRightWidth = "0px";
    iframe.style.borderBottomWidth = "0px";
    iframe.style.borderLeftWidth = "0px";
    iframe.style.direction = "ltr";
    iframe.style.unicodeBidi = "isolate";
    iframe.style.width = `${POPUP_WIDTH}px`;
    iframe.style.height = `${POPUP_HEIGHT}px`;
    iframe.style.left = `${targetPosX - (POPUP_WIDTH - DIFF_CONTENT_WRAPPER) / 2}px`;
    iframe.style.top = `${targetPosY}px`;

    document.documentElement.appendChild(iframe);
    document.onclick = removeInPagePopup;
  } else {
    removeInPagePopup();
  }
}

function removeInPagePopup() {
  const iframe = document.querySelector(`iframe#${INPAGE_POPUP_ID}`);
  iframe?.remove();
  document.onclick = null;
}

function insertCredentialsToFormInputs(label: string, password: string) {
  const { labelInput, passwordInput } = getCredentialsInputs();
  if (labelInput) {
    labelInput.value = label;
  }
  if (passwordInput) {
    passwordInput.value = password;
  }
}

export const interval = setInterval(async () => {
  clearInterval(interval);

  const observerConfig = { attributes: true, childList: true };
  const targetNode: HTMLBodyElement = document.querySelector("body")!;

  const observer = new MutationObserver(installButton);
  observer.observe(targetNode, observerConfig);
}, 100);

// Background Listener
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action == "stateUpdated") {
    const iframe: HTMLIFrameElement = document.querySelector(
      `iframe#${INPAGE_POPUP_ID}`
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  }
});

// Iframe Selected Credentials Listener
window.onmessage = function (msg) {
  const messageEvent = msg.data;
  if (messageEvent.action == "selectedCredential") {
    insertCredentialsToFormInputs(
      messageEvent?.credential?.label,
      messageEvent?.credential?.secret
    );
    removeInPagePopup();
  }
};
