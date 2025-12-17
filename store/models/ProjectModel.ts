
// store/models/ProjectModel.ts
import { Instance, SnapshotIn, types } from "mobx-state-tree";
import { CablesStore } from "../CablesStore";
import { ControlStore } from "../ControlStore";
import { HardwareStore } from "../HardwareStore";

export const ProjectModel = types
.model("Project", {
  id: types.identifier,
  name: types.string,
  createdAt: types.number,

  hardware: types.optional(HardwareStore, {}),
  control: types.optional(ControlStore, {}),
  cables: types.optional(CablesStore, {}),
})
.views((self) => ({
  get createdAtISO() {
    return new Date(self.createdAt).toISOString();
  },
}));

export type ProjectInstance = Instance<typeof ProjectModel>;
export type ProjectSnapshotIn = SnapshotIn<typeof ProjectModel>;
