interface CredentialParameters {
  uid: number;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;
}

export class Credential {
  address: string;
  uid: number;
  title: string;
  url: string;
  label: string;
  secret: string;
  description: string;

  constructor(
    address: string,
    { uid, title, url, label, secret, description }: CredentialParameters
  ) {
    this.address = address;
    this.uid = uid;
    this.title = title;
    this.url = url;
    this.label = label;
    this.secret = secret;
    this.description = description;
  }
}
