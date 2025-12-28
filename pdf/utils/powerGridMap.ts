// pdf/utils/powerGridMap.ts

export type PowerGridCell = {
  row: number;
  col: number;
  powerLineId: string;
  order: number; // order on that power line (1-based)
};

export type PowerLineSummary = {
  lineId: string;
  panelsServed: number;
};

export type ScreenGridDefinition = {
  columnWidthsMm: number[];
  rowHeightsMm: number[];
};

type MapOptions = {
  gridDef: ScreenGridDefinition;
  powerLines: PowerLineSummary[];
};

/**
 * FINAL, CORRECT POWER MAPPING
 *
 * RULES:
 * - Cabinets are traversed in ONE continuous physical order
 * - LEFT → RIGHT by column
 * - TOP → BOTTOM within each column
 * - Circuits consume cabinets sequentially
 * - Circuit boundaries NEVER reset position
 */
export function mapPowerLinesToGrid({
  gridDef,
  powerLines,
}: MapOptions): PowerGridCell[][] {
  const rows = gridDef.rowHeightsMm.length;
  const cols = gridDef.columnWidthsMm.length;

  // Initialize empty grid
  const grid: PowerGridCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols })
  );

  // 1. Build linear cabinet traversal order (SERPENTINE)
  const cabinetPositions: { row: number; col: number }[] = [];

  for (let c = 0; c < cols; c++) {
    const goingDown = c % 2 === 0; // even column = top → bottom

    if (goingDown) {
      for (let r = 0; r < rows; r++) {
        cabinetPositions.push({ row: r, col: c });
      }
    } else {
      for (let r = rows - 1; r >= 0; r--) {
        cabinetPositions.push({ row: r, col: c });
      }
    }
  }


  // 2. Walk cabinets and assign circuits
  let cabinetIndex = 0;

  for (const line of powerLines) {
    let orderOnLine = 1;

    for (let i = 0; i < line.panelsServed; i++) {
      if (cabinetIndex >= cabinetPositions.length) {
        throw new Error("Not enough cabinets for power circuit assignment");
      }

      const { row, col } = cabinetPositions[cabinetIndex];

      grid[row][col] = {
        row,
        col,
        powerLineId: line.lineId,
        order: orderOnLine,
      };

      cabinetIndex++;
      orderOnLine++;
    }
  }

  // 3. Safety check: ensure all cabinets were filled
  if (cabinetIndex < cabinetPositions.length) {
    throw new Error(
      `Power circuits only filled ${cabinetIndex} of ${cabinetPositions.length} cabinets`
    );
  }

  return grid;
}
