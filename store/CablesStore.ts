import { types } from "mobx-state-tree";

export const CablesStore = types
  .model("CablesStore", {
    signalType: types.optional(
      types.enumeration("SignalType", ["Ethernet", "Fiber"]), "Ethernet"),
    signalLength: types.optional(types.number, 10),
    powerType: types.optional(
      types.enumeration("PowerType", ["TRUE1", "BareEnd", "IEC"]), "TRUE1"),
    powerLength: types.optional(types.number, 10),
    homeRun: types.optional(types.boolean, true),
    fiberRequired: types.optional(types.boolean, false),  //expand later
    powerLinking: types.optional(types.string, "N/A"),  //expand later
    signalLinking: types.optional(types.string, "N/A"), //expand later
    voltageInput: types.optional(
      types.union(
        types.literal(120),
        types.literal(208),
        types.literal(230)
      ), 
      120
    ),
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
    setFiberRequired(value: boolean) {
      self.fiberRequired = value;
    },
    setPowerLinking(value: string) {
      self.powerLinking = value;
    },
    setSignalLinking(value: string) {
      self.signalLinking = value;
    },
    setVoltageInput(value: 120 | 208 | 230) {
      if (value !== 120 && value !== 208 && value !== 230) return;
      self.voltageInput = value;
    },
  }));
