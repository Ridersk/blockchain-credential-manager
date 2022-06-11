import { solanaWeb3 } from "../solanaWeb3";
import { Credential } from "models/Credential";
import bs58 from "bs58";

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

// export const titleFilter = (title: string) => ({
//   memcmp: {
//     offset:
//       8 + // Discriminator.
//       32 + // Author public key.
//       8 + // uid
//       4, // Title string prefix
//     bytes: bs58.encode(Buffer.from(title))
//   }
// });

// export const urlFilter = (url: string) => ({
//   memcmp: {
//     offset:
//       8 + // Discriminator.
//       32 + // Author public key.
//       8 + // uid
//       (4 + 50 * 4) + // Title
//       4, // URL string prefix
//     bytes: bs58.encode(Buffer.from(url))
//   }
// });
