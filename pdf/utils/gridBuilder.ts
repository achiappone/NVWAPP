// pdf/utils/gridBuilder.ts

import { ScreenGridDefinition } from "./gridMath";

export function buildInstallationGridFromHardware(hardware: {
  width: number;        // meters
  height: number;       // meters
  application: string;
}): ScreenGridDefinition {

  const application = hardware.application?.trim().toLowerCase();

  const FULL = 1000; // mm
  const HALF = 500;  // mm

  // ─────────────────────────────────────────────
  // INSTALLATION
  // Wide panels
  // Half-meter applies to WIDTH
  // ─────────────────────────────────────────────
  if (application === "installation") {
    const fullColumns = Math.floor(hardware.width);
    const hasHalfColumn = hardware.width % 1 !== 0;

    const columnWidthsMm = [
      ...Array(fullColumns).fill(FULL),
      ...(hasHalfColumn ? [HALF] : []),
    ];

    const rows = Math.round(hardware.height / 0.5);
    const rowHeightsMm = Array(rows).fill(HALF);

    return {
      columnWidthsMm,
      rowHeightsMm,
    };
  }

  // ─────────────────────────────────────────────
  // RENTAL
  // Tall panels
  // Half-meter applies to HEIGHT
  // ─────────────────────────────────────────────
  if (application === "rental") {
    const fullRows = Math.floor(hardware.height);
    const hasHalfRow = hardware.height % 1 !== 0;

    const rowHeightsMm = [
      ...Array(fullRows).fill(FULL),
      ...(hasHalfRow ? [HALF] : []),
    ];

    const columns = Math.round(hardware.width / 0.5);
    const columnWidthsMm = Array(columns).fill(HALF);

    return {
      columnWidthsMm,
      rowHeightsMm,
    };
  }

  // ─────────────────────────────────────────────
  // Unsupported application
  // ─────────────────────────────────────────────
  return {
    columnWidthsMm: [],
    rowHeightsMm: [],
  };
}
