async function loadPopup() {
  const response = await chrome.runtime.sendMessage({
    action: "getState",
    data: []
  });

  const keyring = response?.result?.keyring;
  const isUnlocked = keyring?.isUnlocked;

  if (isUnlocked) {
    document.querySelector("#bcm-credentials-content")?.classList.add("wallet-unlocked");
    await createCredentialsList();
  } else {
    document.querySelector("#bcm-signin-content")?.classList.add("wallet-locked");
    const signinBtn = document.querySelector(".signin-button");

    signinBtn.onclick = async () => {
      await openPopupFromBackground();
    };
  }
}

async function createCredentialsList() {
  const credentialsList = await getCredentialsCurrentSite();
  const listGroup = document.querySelector("#bcm-credentials-content .list-group");

  for (const credential of credentialsList) {
    const listItem = document.createElement("button");
    listItem.classList.add("list-group-item");
    listItem.classList.add("list-group-item-action");
    listItem.innerHTML = `
      <span>${credential.title}</span>
      <span>${credential.label}</span>
    `;
    listGroup.appendChild(listItem);
  }
}

async function getCredentialsCurrentSite() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: "getCredentialsFromCurrentTabURL",
      data: []
    });

    console.log(response);

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
  const response = await chrome.runtime.sendMessage({ action: "openPopup", data: [] });
  console.log(response);
}

loadPopup();
