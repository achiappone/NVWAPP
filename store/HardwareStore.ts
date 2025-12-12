import { types } from "mobx-state-tree";

export const HardwareStore = types
  .model("HardwareStore", {
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    application: types.optional(types.enumeration("Application", ["Rental", "Installation"]), "Rental"),
  })
  .actions((self) => ({
    setWidth(value: number) {
      self.width = value;
    },
    setHeight(value: number) {
        self.height = value;
    },
    setApplication(value: "Rental" | "Installation") {
        self.application = value;
    },
  }));
