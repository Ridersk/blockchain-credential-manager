import { MemoryStore } from "../store/memory-store";
import { PersistentStore } from "../store/persistent-store";

export type PreferencesData = {
  selectedAddress: string;
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

  async setSelectedAddress(address: string) {
    await this.sessionStore.updateState({ selectedAddress: address });
    await this.persistentStore.updateState({ selectedAddress: address });
  }

  async getSelectedAddress() {
    return (await this.sessionStore.getState())?.selectedAddress;
  }
}
