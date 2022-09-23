export function getCredentialsInputs() {
  const passwordInput: HTMLInputElement = document.querySelector(
    "input[type='password']"
  ) as HTMLInputElement;
  const labelInput: HTMLInputElement = getUserInput() as HTMLInputElement;

  return {
    labelInput,
    passwordInput
  };
}

function getUserInput() {
  const matchOptions = [];

  for (const keyword of USER_INPUT_KEYWORDS) {
    for (const attribute of INPUT_ATTRIBUTES) {
      matchOptions.push(
        `contains(translate(@${attribute}, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${keyword}")`
      );
    }
  }

  //input[contains(translate(@id, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "account")]

  return getElementByXpath(`//input[(${matchOptions.join(" or ")}) and not(@type="hidden")]`);
}

function getElementByXpath(path: string) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
}

const INPUT_ATTRIBUTES = ["id", "name", "label", "type", "placeholder"];

const USER_INPUT_KEYWORDS = [
  // English
  "email",
  "e-mail",
  "identification",
  "identifier",
  "username",
  "user",
  "login",
  "account",
  "id",
  // Portuguese
  "usuário",
  "usuario",
  "identificador",
  "identificação",
  "conta"
];
