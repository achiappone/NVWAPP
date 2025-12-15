import { Instance, SnapshotIn, types } from "mobx-state-tree";
import { CablesStore } from "./CablesStore";
import { ControlStore } from "./ControlStore";
import { HardwareStore } from "./HardwareStore";

export const RootStore = types.model("RootStore", {
  hardware: HardwareStore,
  control: types.optional(ControlStore, {}),
  cables: types.optional(CablesStore, {}),
});

export type RootStoreInstance = Instance<typeof RootStore>;
export type RootStoreSnapshotIn = SnapshotIn<typeof RootStore>;

export const createRootStore = (snapshot?: RootStoreSnapshotIn) =>
  RootStore.create(
    snapshot ?? {
      hardware: {},
      control: {},
      cables: {},
    }
  );
