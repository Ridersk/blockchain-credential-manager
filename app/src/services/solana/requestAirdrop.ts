import workspace, { SolanaWeb3Workspace } from "services/solana/solanaWeb3";

const requestAirdrop = async () => {
  const { program, publicKey } = workspace() as SolanaWeb3Workspace;
  // Request airdrop of 1 SOL
  const connection = program.provider.connection;
  const airdropSignature = await connection.requestAirdrop(publicKey, 1000000000);
  await connection.confirmTransaction(airdropSignature);
};

export default requestAirdrop;
