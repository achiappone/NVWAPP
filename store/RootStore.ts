import { types } from "mobx-state-tree";
import { HardwareStore } from "./HardwareStore";


export const RootStore = types.model("RootStore", {
  hardware: HardwareStore,

});

export const createRootStore = (snapshot?: any) =>
  RootStore.create(
    snapshot ?? {
      hardware: {},
      screen: {},
    }
  );
