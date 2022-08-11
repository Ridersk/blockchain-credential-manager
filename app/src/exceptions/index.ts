export class AppInternallError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class WalletNoKeyringFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class WalletIncorrectPasswordError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class WalletLockedError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
