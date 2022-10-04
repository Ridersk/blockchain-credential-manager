import { setupPersistentWorker } from "./workers/persistent-worker";
import { setupVault } from "./workers/vault";

setupApp();

export async function setupApp() {
  setupPersistentWorker();
  await setupVault();
}
