import { solanaWeb3 } from "../solanaWeb3";
import { Credential } from "models/Credential";

const { program, userKeypair } = solanaWeb3();

interface FilterMemcmp {
  offset: number;
  bytes: string;
}

interface FilterOption {
  memcmp: FilterMemcmp;
}

export const getCredentials = async (filters: Array<FilterOption> = []): Promise<Array<Credential>> => {
  filters.push(authorFilter(userKeypair.publicKey.toBase58()));
  const credentials = await program.account.credentialAccount.all(filters);

  return credentials.map((credential) => new Credential(credential.publicKey, credential.account));
};

export const authorFilter = (authorBase58PublicKey: string): FilterOption => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey
  }
});
