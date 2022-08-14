export function getCredentialsInputs() {
  const passwordInput: HTMLInputElement = document.querySelector(
    'input[type="password"]'
  ) as HTMLInputElement;
  const labelInput: HTMLInputElement = passwordInput
    ?.closest("form")
    ?.querySelector("input") as HTMLInputElement;
  return {
    labelInput,
    passwordInput
  };
}
