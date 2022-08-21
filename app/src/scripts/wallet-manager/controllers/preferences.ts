import { MemoryStore } from "../store/memory-store";
import { PersistentStore } from "../store/persistent-store";

export type PreferencesData = {
  selectedAccount: SelectedAccount;
};

export type PreferencesControllerOpts = {
  initState?: PreferencesData;
};

export class PreferencesController {
  sessionStore: MemoryStore<PreferencesData>;
  persistentStore: PersistentStore<PreferencesData>;

  constructor(opts: PreferencesControllerOpts) {
    const { initState } = opts;

    this.sessionStore = new MemoryStore<PreferencesData>("preferences", initState);
    this.persistentStore = new PersistentStore<PreferencesData>("preferences", initState);
  }

  async setSelectedAccount(account: SelectedAccount) {
    await this.sessionStore.updateState({ selectedAccount: account });
    await this.persistentStore.updateState({ selectedAccount: account });
  }

  async getSelectedAccount() {
    return (await this.sessionStore.getState())?.selectedAccount;
  }
}

export type SelectedAccount = {
  id: string;
  address: string;
};
