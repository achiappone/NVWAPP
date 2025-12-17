import { getSnapshot } from "mobx-state-tree";
import { ProjectInstance } from "../store/models/ProjectModel";

export function buildConfigExport(project: ProjectInstance) {
  const snapshot = getSnapshot(project);
  
  return {
    meta: {
      app: "New VW APP",
      version: "0.1",
      exportedAt: new Date().toISOString(),
      projectId: project.id,
      projectName: project.name,
    },
    project: {
      ...snapshot,
      createdAt: new Date(snapshot.createdAt).toISOString(),
    },
  };
}
