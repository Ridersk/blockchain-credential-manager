import { SessionStore } from "../store/variants/session-store";
import { PersistentStore } from "../store/variants/persistent-store";

export type PreferencesData = {
  selectedAccount: SelectedAccount;
};

export type PreferencesControllerOpts = {
  initState?: PreferencesData;
};

export class PreferencesController {
  sessionStore: SessionStore<PreferencesData>;
  persistentStore: PersistentStore<PreferencesData>;

  constructor(opts: PreferencesControllerOpts) {
    const { initState } = opts;

    this.sessionStore = new SessionStore<PreferencesData>("preferences", initState);
    this.persistentStore = new PersistentStore<PreferencesData>("preferences", initState);
  }

  async setSelectedAccount(account: SelectedAccount) {
    await this.sessionStore.updateState({ selectedAccount: account });
    await this.persistentStore.updateState({ selectedAccount: account });
  }

  async getSelectedAccount() {
    return (await this.sessionStore.getState())?.selectedAccount;
  }

  async reset() {
    await this.sessionStore.clearState();
    await this.persistentStore.clearState();
  }
}

export type SelectedAccount = {
  id: string;
  address: string;
};
