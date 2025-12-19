// utils/buildConfigExport.ts

import { getSnapshot } from "mobx-state-tree";
import { ProjectInstance } from "../store/models/ProjectModel";

export function buildConfigExport(project: ProjectInstance) {
  const snapshot = getSnapshot(project);

  //temporary, until implemented elsewhere
  const screenLabel = "Screen A";


  const hardware = snapshot.hardware;
  const control = snapshot.control;
  const cables = snapshot.cables;

  const widthMeters = hardware.width ?? 0;
  const heightMeters = hardware.height ?? 0;

  const panelWidthMeters = 1.0;   // 1000mm
  const panelHeightMeters = 0.5;  // 500mm

  const panelsWide =
    panelWidthMeters > 0
      ? Math.round(widthMeters / panelWidthMeters)
      : 0;

  const panelsHigh =
    panelHeightMeters > 0
      ? Math.round(heightMeters / panelHeightMeters)
      : 0;

  const aspectRatio =
    heightMeters > 0
      ? `${Math.round((widthMeters / heightMeters) * 100) / 100}:1`
      : "N/A";

  return {
    meta: {
      app: "New VW APP",
      version: "0.1",
      exportedAt: new Date().toISOString(),
      projectId: project.id,
      projectName: project.name,
    },

project: {
  id: snapshot.id,
  name: snapshot.name,
  application: project.hardware.application,
  createdAt: new Date(snapshot.createdAt).toISOString(),

  screens: [
    {
      label: screenLabel,

      hardware: {
        pixelPitch: hardware.pixelPitch,
        width: widthMeters,
        height: heightMeters,
        aspectRatio,
        panelsWide,
        panelsHigh,
      },

      control: {
        processorModel: control.processorModel,
        sourceResolution: control.sourceResolution,
        refreshRate: control.refreshRate,
        bitDepth: control.bitDepth,
        hdr: control.hdr,
      },

      cables: {
        fiberRequired: cables.fiberRequired,
        powerLinking: cables.powerLinking,
        signalLinking: cables.signalLinking,
      },
    },
  ],
},

  };
}

