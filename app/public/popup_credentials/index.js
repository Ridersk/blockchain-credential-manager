async function loadPopup() {
  const response = await chrome.runtime.sendMessage({
    action: "getState",
    data: []
  });

  const keyring = response?.result?.keyring;
  const isUnlocked = keyring?.isUnlocked;

  if (isUnlocked) {
    document.querySelector("#bcm-credentials-content")?.classList?.remove("not-display");
    await createCredentialsList();
  } else {
    document.querySelector("#bcm-signin-content")?.classList?.remove("not-display");
    const signinBtn = document.querySelector(".signin-button");

    signinBtn.onclick = async () => {
      await openPopupFromBackground();
    };
  }
}

async function createCredentialsList() {
  const loadingElem = document.querySelector("#bcm-credentials-content .loading-div");
  const listGroup = document.querySelector("#bcm-credentials-content .list-group");

  loadingElem.classList.remove("not-display");

  try {
    const credentialsList = await getCredentialsCurrentDomainFromBackground();
    for (const credential of credentialsList) {
      const listItem = document.createElement("button");
      listItem.classList.add("list-group-item");
      listItem.classList.add("list-group-item-action");
      listItem.innerHTML = `
        <span class="mr-2 credential-item-text credential-item-title">${credential.title}</span>
        <small class="credential-item-text">${credential.label}</small>
      `;
      listGroup.appendChild(listItem);
      listItem.onclick = async () => {
        await sendCredentialsToCurrentPage(credential);
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
    console.log(error);
    return [];
  }
}

async function openPopupFromBackground() {
  await chrome.runtime.sendMessage({ action: "openPopup", data: [] });
}

async function sendCredentialsToCurrentPage(credential) {
  window.top.postMessage({ action: "selectedCredential", credential }, "*");
}

loadPopup();
