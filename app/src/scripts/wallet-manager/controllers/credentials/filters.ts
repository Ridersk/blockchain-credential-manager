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
