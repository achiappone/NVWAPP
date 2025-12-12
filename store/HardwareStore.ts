import { types } from "mobx-state-tree";

export const HardwareStore = types
  .model("HardwareStore", {
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
  })
  .actions((self) => ({
    setWidth(value: number) {
      self.width = value;
    },
    setHeight(value: number) {
        self.height = value;
    },
  }));
