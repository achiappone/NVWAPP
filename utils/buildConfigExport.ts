import { getSnapshot } from "mobx-state-tree";
import { RootStoreInstance } from "../store/RootStore";

export function buildConfigExport(rootStore: RootStoreInstance) {
  return {
    meta: {
      app: "NVW APP",
      version: "0.1",
      exportedAt: new Date().toISOString(),
    },
    hardware: getSnapshot(rootStore.hardware),
    control: getSnapshot(rootStore.control),
    cables: getSnapshot(rootStore.cables),
  };
}
