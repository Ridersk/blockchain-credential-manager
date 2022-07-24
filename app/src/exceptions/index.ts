export class WalletInternallError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class VaultNoKeyringFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class VaultIncorrectPasswordError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class VaultLockedError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
