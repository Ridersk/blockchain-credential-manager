export function getCredentialsInputs() {
  const passwordInput: HTMLInputElement = document.querySelector(
    "input[type='password']"
  ) as HTMLInputElement;
  const labelInput: HTMLInputElement = getUserInput() as HTMLInputElement;

  // const labelInput: HTMLInputElement = passwordInput
  //   ?.closest("form")
  //   ?.querySelector("input") as HTMLInputElement;
  return {
    labelInput,
    passwordInput
  };
}

// // input[contains(@label, "E-mail") or contains(translate(@label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "senha")]
function getUserInput() {
  const matchOptions = [];

  for (const option of USER_INPUT_NAME_CONTAIN_OPTIONS) {
    matchOptions.push(
      `contains(translate(@id, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${option}")`
    );
    matchOptions.push(
      `contains(translate(@label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${option}")`
    );
    matchOptions.push(
      `contains(translate(@name, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${option}")`
    );
  }

  console.log(
    "Complete username XPATH: ",
    `//input[(${matchOptions.join(" or ")}) and not(@type="hidden")]`
  );

  return getElementByXpath(`//input[(${matchOptions.join(" or ")}) and not(@type="hidden")]`);
}

function getElementByXpath(path: string) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
}

const USER_INPUT_NAME_CONTAIN_OPTIONS = [
  // English
  "email",
  "e-mail",
  "identification",
  "identifier",
  "username",
  "user",
  // Portuguese
  "usuário",
  "identificador"
];
