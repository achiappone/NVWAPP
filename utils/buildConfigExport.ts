// utils/buildConfigExport.ts

import { ExportDocument } from "@/pdf/types";
import { buildInstallationGridFromHardware } from "@/pdf/utils/gridBuilder";
import { getSnapshot } from "mobx-state-tree";
import { ProjectInstance } from "../store/models/ProjectModel";
import { resolvePanelModel } from "./resolvePanelModel";

export function buildConfigExport(project: ProjectInstance): ExportDocument {
  const snapshot = getSnapshot(project);

  //temporary, until implemented elsewhere
  const screenLabel = "Screen A";

  const hardware = snapshot.hardware;
  const control = snapshot.control;
  const cables = snapshot.cables;

  // 🚫 PREVIEW / INCOMPLETE PROJECT GUARD
  if (
    snapshot.hardware.pixelPitch <= 0 ||
    snapshot.hardware.width <= 0 ||
    snapshot.hardware.height <= 0
  ) {
    throw new Error("Project is incomplete and cannot be exported yet.");
  }


  
  const panelSpec = resolvePanelModel({
    application: hardware.application,
    pixelPitch: hardware.pixelPitch,
  });

  if (!panelSpec) {
    throw new Error(
      `Panel model could not be resolved for ${hardware.application} @ ${hardware.pixelPitch}mm`
    );
  }

  //console.log("Resolved panel spec:", panelSpec);

  const widthMeters = hardware.width ?? 0;
  const heightMeters = hardware.height ?? 0;
  const aspectRatio =
    heightMeters > 0
      ? `${Math.round((widthMeters / heightMeters) * 100) / 100}:1`
      : "N/A";

  const gridDef = buildInstallationGridFromHardware({
    width: widthMeters,
    height: heightMeters,
    application: hardware.application,
  });

  // ✅ FALLBACK / GUARD
  if (
    gridDef.columnWidthsMm.length === 0 ||
    gridDef.rowHeightsMm.length === 0
  ) {
    throw new Error(
      `Invalid grid definition for ${hardware.application} ` +
      `(${widthMeters}m x ${heightMeters}m)`
    );
  }

  const panelsWide = gridDef.columnWidthsMm.length;
  const panelsHigh = gridDef.rowHeightsMm.length;



  return {
    meta: {
      app: "New VW APP",
      version: "0.1",
      projectId: project.id,
      exportedAt: new Date().toISOString(),
      projectName: project.name,
      modelName: panelSpec.model,
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
        widthMeters: widthMeters,
        heightMeters: heightMeters,
        aspectRatio: aspectRatio,
        panelsWide: panelsWide,
        panelsHigh: panelsHigh,
        maxWattsPerPanel: panelSpec.maxWattsPerPanel,
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
        inputVoltage: cables.voltageInput,
      },

    },
  ],
},

  };
}

