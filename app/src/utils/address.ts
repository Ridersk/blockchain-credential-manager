export function formatAddress(
  address: string,
  maxLength: number = 12,
  sequenceLength: number = 4
): string {
  if (address.length > maxLength) {
    return (
      address.substring(0, sequenceLength) +
      "..." +
      address.substring(address.length - sequenceLength, address.length)
    );
  }
  return address;
}
