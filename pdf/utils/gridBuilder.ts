// pdf/utils/gridBuilder.ts

import { ScreenGridDefinition } from "./gridMath";

export function buildInstallationGridFromHardware(hardware: {
  width: number;        // meters
  height: number;       // meters
  application: string;
}): ScreenGridDefinition {

  if (hardware.application !== "Installation") {
    return {
      columnWidthsMm: [],
      rowHeightsMm: [],
    };
  }

  const FULL_WIDTH = 1000;
  const HALF_WIDTH = 500;
  const PANEL_HEIGHT = 500;

  const fullColumns = Math.floor(hardware.width);
  const hasHalfColumn = hardware.width % 1 !== 0;

  const columnWidthsMm = [
    ...Array(fullColumns).fill(FULL_WIDTH),
    ...(hasHalfColumn ? [HALF_WIDTH] : []),
  ];

  const rows = Math.round(hardware.height / 0.5);
  const rowHeightsMm = Array(rows).fill(PANEL_HEIGHT);

  return {
    columnWidthsMm,
    rowHeightsMm,
  };
}
