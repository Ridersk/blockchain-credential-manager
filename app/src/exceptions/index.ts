export class WalletInternallError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class WalletIncorrectPasswordError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
