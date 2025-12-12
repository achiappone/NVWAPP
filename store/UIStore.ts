import { types } from "mobx-state-tree";

export const UIStore = types
  .model("UIStore", {
    theme: types.optional(types.enumeration(["light", "dark"]), "light"),
  })
  .actions((self) => ({
    toggleTheme() {
      self.theme = self.theme === "light" ? "dark" : "light";
    },
  }));
