// domain/powerGrid.ts

import { buildInstallationGridFromHardware } from "@/pdf/utils/gridBuilder";
import { mapPowerLinesToGrid } from "@/pdf/utils/powerGridMap";
import { buildPowerLines } from "@/pdf/utils/powerModel";
import { resolvePanelModel } from "@/utils/resolvePanelModel";

export type PowerGridInput = {
  width: number;
  height: number;
  application: string;
  pixelPitch: number;
  inputVoltage: 120 | 208 | 230;
};

export function calculatePowerGrid(input: PowerGridInput) {
  const {
    width,
    height,
    application,
    pixelPitch,
    inputVoltage,
  } = input;

  // 1. Resolve panel model
  const panelSpec = resolvePanelModel({
    application,
    pixelPitch,
  });

  if (!panelSpec) {
    return null;
  }

  // 2. Resolve physical grid
  const gridDef = buildInstallationGridFromHardware({
    width,
    height,
    application,
  });

  if (
    gridDef.columnWidthsMm.length === 0 ||
    gridDef.rowHeightsMm.length === 0
  ) {
    return null;
  }

  const panelsWide = gridDef.columnWidthsMm.length;
  const panelsHigh = gridDef.rowHeightsMm.length;
  const totalPanels = panelsWide * panelsHigh;

  // 3. Build power lines
  const powerLines = buildPowerLines({
    totalPanels,
    panelMaxWatts: panelSpec.maxWattsPerPanel,
    inputVoltage,
    maxCircuitCurrent: 16,
    safetyFactor: 0.8,
  });

  if (!powerLines.length) {
    return null;
  }

  // 4. Map circuits to grid
  const powerGrid = mapPowerLinesToGrid({
    gridDef,
    powerLines,
  });

  return {
    panelModel: panelSpec.model,
    panelsWide,
    panelsHigh,
    powerLines,
    powerGrid,
    gridDef,
  };
}
