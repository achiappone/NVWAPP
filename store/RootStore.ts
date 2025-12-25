
// store/RootStore.ts

import { Instance, SnapshotIn, types } from "mobx-state-tree";
import { ProjectModel } from "./models/ProjectModel";

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const RootStore = types
  .model("RootStore", {
    projects: types.map(ProjectModel),
    activeProjectId: types.maybe(types.string),
  })
  .views((self) => ({
    get activeProject() {
      if (!self.activeProjectId) return undefined;
      return self.projects.get(self.activeProjectId);
    },

    get projectList() {
      return Array.from(self.projects.values()).sort(
        (a, b) => b.createdAt - a.createdAt
      );
    },
  }))
  .actions((self) => ({
    createProject(name: string) {
      const id = makeId();

      self.projects.set(id, {
        id,
        name,
        createdAt: Date.now(),
      });

      self.activeProjectId = id;
      return id;
    },

    ensureDefaultProject() {
      if (self.projects.size === 0) {
        const id = makeId();

        self.projects.set(id, {
          id,
          name: "New Project",
          createdAt: Date.now(),
        });

        self.activeProjectId = id;
      } else if (!self.activeProjectId) {
        self.activeProjectId = Array.from(self.projects.keys())[0];
      }
    },

    setActiveProject(id: string) {
      if (self.projects.has(id)) {
        self.activeProjectId = id;
      }
    },

    renameProject(id: string, name: string) {
      const p = self.projects.get(id);
      if (p) p.name = name;
    },

    deleteProject(id: string) {
      self.projects.delete(id);

      if (self.activeProjectId === id) {
        const next = Array.from(self.projects.keys())[0];
        self.activeProjectId = next ?? undefined;
      }
    },
    replaceAllProjects(projectsSnapshot: Record<string, any>) {
      self.projects.clear();

      Object.entries(projectsSnapshot).forEach(([id, project]) => {
        self.projects.set(id, project);
      });

      // Set active project to first imported project (or undefined)
      const firstId = Object.keys(projectsSnapshot)[0];
      self.activeProjectId = firstId ?? undefined;
    },

  }));

export type RootStoreInstance = Instance<typeof RootStore>;
export type RootStoreSnapshotIn = SnapshotIn<typeof RootStore>;

export function createRootStore() {
  const store = RootStore.create({
    projects: {},
    activeProjectId: undefined,
  });

  store.ensureDefaultProject();
  return store;
}
