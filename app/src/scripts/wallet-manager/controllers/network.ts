export type NetworkControllerOpts = {
  initNetwork?: NetworkOption;
  updateCallback: (key: string, data: any) => Promise<void>;
  getState: () => Promise<any>;
};

export class NetworkController {
  private _updateCallback: (key: string, data: any) => Promise<void>;
  private _getStateFunc: () => Promise<any>;

  constructor(opts: NetworkControllerOpts) {
    const { initNetwork, updateCallback, getState } = opts;

    this._updateCallback = updateCallback;
    this._getStateFunc = getState;
  }

  async change(networkId: string) {
    const network = NETWORK_OPTIONS[networkId as keyof typeof NETWORK_OPTIONS];
    await this._updateCallback("network", network);
  }

  async getCurrent(): Promise<NetworkOption> {
    return (await this._getStateFunc()).network;
  }
}

export type NetworkOption = {
  id: string;
  label: string;
  url: string;
};

export const NETWORK_OPTIONS = {
  mainnet: {
    id: "mainnet",
    label: "Mainnet",
    url: "https://api.mainnet-beta.solana.com"
  },
  testnet: {
    id: "testnet",
    label: "Testnet",
    url: "https://api.testnet.solana.com"
  },
  devnet: {
    id: "devnet",
    label: "Devnet",
    url: "https://api.devnet.solana.com"
  },
  local: {
    id: "local",
    label: "Local",
    url: "http://localhost:8899"
  }
};
