// store/models/ControlStore.ts
import { types } from "mobx-state-tree";

export const ControlStore = types
  .model("ControlStore", {
    // Processor
    processorModel: types.optional(types.string, ""),

    // Input signal
    sourceResolution: types.optional(types.string, "4K (3840x2160)"),
    refreshRate: types.optional(types.number, 60),
    bitDepth: types.optional(types.number, 10),
    hdr: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setProcessorModel(val: string) {
      self.processorModel = val;
    },
    setSourceResolution(val: string) {
      self.sourceResolution = val;
    },
    setRefreshRate(val: number) {
      self.refreshRate = val;
    },
    setBitDepth(val: number) {
      self.bitDepth = val;
    },
    setHdr(val: boolean) {
      self.hdr = val;
    },
  }));
