//domain/signalPreviewGrid.ts

import { CabinetRect } from "@/pdf/utils/gridMath";

/**
 * Builds a 2D grid [row][col] → portIndex
 * Used ONLY for preview rendering (not PDF)
 */
export function buildSignalPreviewGrid(
  cabinets: CabinetRect[],
  cabinetPortMap: number[]
): number[][] {
  if (cabinets.length === 0) return [];

  const rows =
    Math.max(...cabinets.map(c => c.row)) + 1;
  const cols =
    Math.max(...cabinets.map(c => c.col)) + 1;

  const grid: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => -1)
  );

  cabinets.forEach((cab, index) => {
    grid[cab.row][cab.col] = cabinetPortMap[index] ?? -1;
  });

  return grid;
}
