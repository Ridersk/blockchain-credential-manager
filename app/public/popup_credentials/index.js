async function loadPopup() {
  const response = await chrome.runtime.sendMessage({
    action: "getState",
    data: []
  });

  const keyring = response?.result?.keyring;
  const isUnlocked = keyring?.isUnlocked;

  if (isUnlocked) {
    document.querySelector("#bcm-credentials-content")?.classList?.remove("not-display");
    await setupPopupContent();
  } else {
    document.querySelector("#bcm-signin-content")?.classList?.remove("not-display");
    const signinBtn = document.querySelector("#signin-button");

    signinBtn.onclick = async () => {
      await openPopupFromBackground();
    };
  }
}

async function setupPopupContent() {
  setupCreateCredentialBtn();
  setupGenerateCredentialBtn();
  await createCredentialsList();
}

function setupCreateCredentialBtn() {
  const btnCreateCredential = document.querySelector("#create-credential");

  btnCreateCredential.onclick = async () => {
    await openPopupFromBackground("credential");
  };
}

function setupGenerateCredentialBtn() {
  const btnGenerateCredential = document.querySelector("#generate-credential");

  btnGenerateCredential.onclick = async () => {
    await openPopupFromBackground("generate");
  };
}

async function createCredentialsList() {
  const loadingElem = document.querySelector("#bcm-credentials-content .loading-div");
  const listGroup = document.querySelector("#bcm-credentials-content .list-group");

  loadingElem.classList.remove("not-display");
  try {
    const credentialsList = await getCredentialsCurrentDomainFromBackground();
    for (const credential of credentialsList) {
      const listItem = document.createElement("div");
      listItem.classList.add("list-group-item");
      listItem.classList.add("list-group-item-action");
      listItem.innerHTML = `
        <div class="credential-item-content-wrapper">
          <div class="credential-item-data">
            <span class="credential-item-text credential-item-title">${credential.title}</span>
            <small class="credential-item-text">${credential.label}</small>
          </div>
          <button type="button" class="edit-btn action-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      `;
      listGroup.appendChild(listItem);
      listItem.onclick = async () => {
        await sendCredentialsToCurrentPage(credential);
      };
      listItem.querySelector(".edit-btn").onclick = async () => {
        await openPopupFromBackground("credential", { cred: credential?.address });
      };
    }
  } finally {
    loadingElem.classList.add("not-display");
  }
}

async function getCredentialsCurrentDomainFromBackground() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: "getCredentialsFromCurrentTabURL",
      data: []
    });

    if (response?.error || !response?.result) {
      throw new Error(response.error);
    }

    return response?.result;
  } catch (error) {
    return [];
  }
}

async function openPopupFromBackground(path, searchParams) {
  const msgParams = [];

  if (!path) {
    path = "";
  }

  if (!searchParams) {
    searchParams = {};
  }

  msgParams.push(path);
  msgParams.push(searchParams);

  await chrome.runtime.sendMessage({ action: "openPopup", data: msgParams });
}

async function sendCredentialsToCurrentPage(credential) {
  window.top.postMessage({ action: "selectedCredential", credential }, "*");
}

loadPopup();
