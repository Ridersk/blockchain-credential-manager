import { MemoryStore } from "../store/variants/memory-store";
import { PersistentStore } from "../store/variants/persistent-store";
import { NetworkController, NetworkOption } from "./network";

export type PreferencesData = {
  selectedAccount: SelectedAccount;
  network: NetworkOption;
};

export type PreferencesControllerOpts = {
  initState?: PreferencesData;
};

export class PreferencesController {
  memoryStore: MemoryStore<PreferencesData>;
  persistentStore: PersistentStore<PreferencesData>;
  networkController: NetworkController;

  constructor(opts: PreferencesControllerOpts) {
    const { initState } = opts;

    this.memoryStore = new MemoryStore<PreferencesData>("preferences", initState);
    this.persistentStore = new PersistentStore<PreferencesData>("preferences", initState);

    this.networkController = new NetworkController({
      initNetwork: initState?.network,
      updateCallback: this._update.bind(this),
      getState: this._get.bind(this)
    });
  }

  async setSelectedAccount(account: SelectedAccount) {
    await this._update("selectedAccount", account);
  }

  async getSelectedAccount() {
    return (await this._get()).selectedAccount;
  }

  async reset() {
    await this.memoryStore.clearState();
    await this.persistentStore.clearState();
  }

  async changeNetwork(networkId: string) {
    await this.networkController.change(networkId);
  }

  async getCurrentNetwork() {
    return this.networkController.getCurrent();
  }

  async _update(key: string, data: any) {
    await this.memoryStore.updateState({ [key]: data });
    await this.persistentStore.updateState({ [key]: data });
  }

  async _get(): Promise<PreferencesData> {
    return (await this.memoryStore.getState()) || (await this.persistentStore.getState());
  }
}

export type SelectedAccount = {
  id: string;
  address: string;
};
