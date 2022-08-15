import bs58 from "bs58";

export interface FilterMemcmp {
  offset: number;
  bytes: string;
}

export interface FilterOption {
  memcmp: FilterMemcmp;
}

export const ownerFilter = (ownerBase58PublicKey: string): FilterOption => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: ownerBase58PublicKey
  }
});

// export const titleFilter = (title: string): FilterOption => ({
//   memcmp: {
//     offset:
//       8 + // Discriminator
//       32 + // Owner address
//       8 + // UID
//       4, // Title string prefix
//     bytes: bs58.encode(Buffer.from(title))
//   }
// });

export const urlFilter = (url: string): FilterOption => ({
  memcmp: {
    offset:
      8 + // Discriminator
      32 + // Owner address
      8 + // UID
      // (4 + 50 * 4) + // Title
      4, // URL string prefix
    bytes: bs58.encode(Buffer.from(url))
  }
});
