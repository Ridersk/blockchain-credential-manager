interface CredentialParameters {
  uid: number;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

export class Credential {
  publicKey: string;
  uid: number;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;

  constructor(
    publicKey: string,
    { uid, title, url, label, secret, description }: CredentialParameters
  ) {
    this.publicKey = publicKey;
    this.uid = uid;
    this.title = title;
    this.url = url;
    this.label = label;
    this.secret = secret;
    this.description = description;
  }

  // get publicKey() {
  //   return this._publicKey;
  // }

  // get label() {
  //   return this._label;
  // }

  // get secret() {
  //   return this._secret;
  // }
}
