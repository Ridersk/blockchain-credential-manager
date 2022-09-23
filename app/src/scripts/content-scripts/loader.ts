import Logger from "../../utils/log";
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

      console.log("LABEL INPUT:", labelInput);

      const btnBase = document.createElement("div");
      const buttonIcon = document.createElement("img");
      btnBase.id = BUTTON_ID;
      buttonIcon.src = chrome.runtime.getURL("assets/action-btn.png");
      btnBase.appendChild(buttonIcon);

      if (passwordInput) {
        const btnPassword: HTMLDivElement = btnBase.cloneNode(true) as HTMLDivElement;
        updateBtnActionPositionBasedOnAnchor(btnPassword, passwordInput);
        passwordInput?.parentNode?.insertBefore(btnPassword, passwordInput.nextSibling);

        window.addEventListener("resize", () => {
          updateBtnActionPositionBasedOnAnchor(btnPassword, passwordInput);
        });
      }

      if (labelInput) {
        const btnLabel: HTMLDivElement = btnBase.cloneNode(true) as HTMLDivElement;
        updateBtnActionPositionBasedOnAnchor(btnLabel, labelInput);
        labelInput?.parentNode?.insertBefore(btnLabel, labelInput.nextSibling);

        window.addEventListener("resize", () => {
          updateBtnActionPositionBasedOnAnchor(btnLabel, labelInput);
        });
      }

      const btnsAction: NodeListOf<HTMLElement> = document?.querySelectorAll(`#${BUTTON_ID}`);
      for (let btn of btnsAction) {
        btn.onclick = async (event) => {
          event.stopPropagation();
          await toggleInPagePopup(btn);
        };
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}

async function toggleInPagePopup(anchorElem: HTMLElement) {
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

    updatePopupPositionBasedOnAnchor(iframe, anchorElem);
    window.addEventListener("resize", () => {
      updatePopupPositionBasedOnAnchor(iframe, anchorElem);
    });

    document.documentElement.appendChild(iframe);
    document.onclick = removeInPagePopup;
  } else {
    removeInPagePopup();
  }
}

function updateBtnActionPositionBasedOnAnchor(btnElement: HTMLElement, anchorElement: HTMLElement) {
  if (btnElement && anchorElement) {
    const btnMargin = 8;
    // const anchorRect = anchorElement.getBoundingClientRect();
    const size = anchorElement.offsetHeight * 0.72;
    const btnTopPos = anchorElement.offsetTop + anchorElement.offsetHeight / 2 - size / 2;
    const btnLeftPos = anchorElement.offsetLeft - size - btnMargin;

    btnElement.style.height = `${size}px`;
    btnElement.style.width = `${size}px`;
    btnElement.style.top = `${btnTopPos}px`;
    btnElement.style.left = `${btnLeftPos}px`;
  }
}

function updatePopupPositionBasedOnAnchor(element: HTMLElement, anchorElement: HTMLElement) {
  if (element) {
    const anchorPos = anchorElement.getBoundingClientRect();
    const anchorPosX = anchorPos.x + window.scrollX + anchorPos.width / 2;
    const anchorPosY = anchorPos.top + window.scrollY + anchorPos.height;

    element.style.left = `${anchorPosX - (POPUP_WIDTH - DIFF_CONTENT_WRAPPER) / 2}px`;
    element.style.top = `${anchorPosY}px`;
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

  const observer = new MutationObserver(installButton);
  observer.observe(document.body, { attributes: true, childList: true });
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
  } else if (request.action === "credentialSaved") {
    insertCredentialsToFormInputs(request.data?.label, request.data?.password);
    removeInPagePopup();
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
