import { SessionStore } from "../store/variants/session-store";
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
  sessionStore: SessionStore<PreferencesData>;
  persistentStore: PersistentStore<PreferencesData>;
  networkController: NetworkController;

  constructor(opts: PreferencesControllerOpts) {
    const { initState } = opts;

    this.sessionStore = new SessionStore<PreferencesData>("preferences", initState);
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
    await this.sessionStore.clearState();
    await this.persistentStore.clearState();
  }

  async changeNetwork(networkId: string) {
    await this.networkController.change(networkId);
  }

  async getCurrentNetwork() {
    return this.networkController.getCurrent();
  }

  async _update(key: string, data: any) {
    await this.sessionStore.updateState({ [key]: data });
    await this.persistentStore.updateState({ [key]: data });
  }

  async _get(): Promise<PreferencesData> {
    return (await this.sessionStore.getState()) || (await this.persistentStore.getState());
  }
}

export type SelectedAccount = {
  id: string;
  address: string;
};
