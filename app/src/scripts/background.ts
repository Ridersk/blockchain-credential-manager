import { setupAlarms } from "./workers/alarms";
import { setupPersistentWorker } from "./workers/persistent-worker";
import { setupVault } from "./workers/vault";

setupApp();

export async function setupApp() {
  setupAlarms();
  setupPersistentWorker();
  await setupVault();
}
