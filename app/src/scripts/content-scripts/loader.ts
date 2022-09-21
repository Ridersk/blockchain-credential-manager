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

      if (passwordInput) {
        const size = passwordInput?.offsetHeight * 0.72;
        const btnMargin = 8;
        const btnPasswordTopPos =
          passwordInput.offsetTop + passwordInput.offsetHeight / 2 - size / 2;
        const btnPasswordLeftPos = passwordInput.offsetLeft - size - btnMargin;

        const btnPassword = document.createElement("div");
        btnPassword.id = BUTTON_ID;
        btnPassword.style.height = `${size}px`;
        btnPassword.style.width = `${size}px`;
        btnPassword.style.top = `${btnPasswordTopPos}px`;
        btnPassword.style.left = `${btnPasswordLeftPos}px`;

        const buttonImg = document.createElement("img");
        buttonImg.src = chrome.runtime.getURL("assets/action-btn.png");
        btnPassword.appendChild(buttonImg);
        passwordInput?.parentNode?.insertBefore(btnPassword, passwordInput.nextSibling);

        const btnLabel: HTMLDivElement = btnPassword.cloneNode(true) as HTMLDivElement;
        const btnLabelTopPos = labelInput.offsetTop + labelInput.offsetHeight / 2 - size / 2;
        const btnLabelLeftPos = labelInput.offsetLeft - size - btnMargin;
        btnLabel.style.top = `${btnLabelTopPos}px`;
        btnLabel.style.left = `${btnLabelLeftPos}px`;
        labelInput?.parentNode?.insertBefore(btnLabel, labelInput.nextSibling);

        const btnsAction: NodeListOf<HTMLElement> = document?.querySelectorAll(`#${BUTTON_ID}`);
        for (let btn of btnsAction) {
          btn.onclick = async (event) => {
            event.stopPropagation();
            await toggleInPagePopup(btn);
          };
        }
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

    updateInPagePopupPosition(anchorElem, iframe);
    window.onresize = () => {
      updateInPagePopupPosition(anchorElem, iframe);
    };

    document.documentElement.appendChild(iframe);
    document.onclick = removeInPagePopup;
  } else {
    removeInPagePopup();
  }
}

function updateInPagePopupPosition(anchorElement: HTMLElement, iframeElement: HTMLIFrameElement) {
  if (iframeElement) {
    const anchorPos = anchorElement.getBoundingClientRect();
    const anchorPosX = anchorPos.x + window.scrollX + anchorPos.width / 2;
    const anchorPosY = anchorPos.top + window.scrollY + anchorPos.height;

    iframeElement.style.left = `${anchorPosX - (POPUP_WIDTH - DIFF_CONTENT_WRAPPER) / 2}px`;
    iframeElement.style.top = `${anchorPosY}px`;
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
