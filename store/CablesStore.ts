import { types } from "mobx-state-tree";

export const CablesStore = types
  .model("CablesStore", {
    signalType: types.optional(
      types.enumeration("SignalType", ["Ethernet", "Fiber"]),
      "Ethernet"
    ),
    signalLength: types.optional(types.number, 10),

    powerType: types.optional(
      types.enumeration("PowerType", ["TRUE1", "BareEnd", "IEC"]),
      "TRUE1"
    ),
    powerLength: types.optional(types.number, 10),

    homeRun: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setSignalType(value: "Ethernet" | "Fiber") {
      self.signalType = value;
    },
    setSignalLength(value: number) {
      self.signalLength = value;
    },
    setPowerType(value: "TRUE1" | "BareEnd" | "IEC") {
      self.powerType = value;
    },
    setPowerLength(value: number) {
      self.powerLength = value;
    },
    setHomeRun(value: boolean) {
      self.homeRun = value;
    },
  }));
