// pdf/utils/gridMath.ts

/**
 * Defines the physical cabinet layout of the screen.
 * Widths and heights are in millimeters.
 */
export type ScreenGridDefinition = {
  columnWidthsMm: number[]; // e.g. [1000, 1000, 1000, 500]
  rowHeightsMm: number[];   // e.g. [500, 500, 500, 500]
};

/**
 * Computed geometry for a single cabinet
 */
export type CabinetRect = {
  row: number;
  col: number;
  x: number;       // mm from left
  y: number;       // mm from top
  width: number;   // mm
  height: number;  // mm
};

/**
 * Full computed grid geometry
 */
export type ScreenGridGeometry = {
  totalWidthMm: number;
  totalHeightMm: number;

  columnOffsetsMm: number[]; // x start of each column
  rowOffsetsMm: number[];    // y start of each row

  cabinets: CabinetRect[];
};

/**
 * Compute cumulative offsets from an array of sizes.
 * Example: [1000, 1000, 500] → [0, 1000, 2000]
 */
function computeOffsets(sizes: number[]): number[] {
  const offsets: number[] = [];
  let acc = 0;

  for (let i = 0; i < sizes.length; i++) {
    offsets.push(acc);
    acc += sizes[i];
  }

  return offsets;
}

/**
 * Main grid math entry point.
 * This function is the single source of truth for cabinet geometry.
 */
export function buildScreenGridGeometry(
  grid: ScreenGridDefinition
): ScreenGridGeometry {
  const { columnWidthsMm, rowHeightsMm } = grid;

  const columnOffsetsMm = computeOffsets(columnWidthsMm);
  const rowOffsetsMm = computeOffsets(rowHeightsMm);

  const totalWidthMm = columnWidthsMm.reduce((a, b) => a + b, 0);
  const totalHeightMm = rowHeightsMm.reduce((a, b) => a + b, 0);

  const cabinets: CabinetRect[] = [];

  for (let row = 0; row < rowHeightsMm.length; row++) {
    for (let col = 0; col < columnWidthsMm.length; col++) {
      cabinets.push({
        row,
        col,
        x: columnOffsetsMm[col],
        y: rowOffsetsMm[row],
        width: columnWidthsMm[col],
        height: rowHeightsMm[row],
      });
    }
  }

  return {
    totalWidthMm,
    totalHeightMm,
    columnOffsetsMm,
    rowOffsetsMm,
    cabinets,
  };
}

/**
 * Helper: get a cabinet by row/column
 */
export function getCabinet(
  geometry: ScreenGridGeometry,
  row: number,
  col: number
): CabinetRect | undefined {
  return geometry.cabinets.find(
    (c) => c.row === row && c.col === col
  );
}

/**
 * Helper: returns cabinets in wiring order
 * Default is left-to-right, top-to-bottom
 * (override later for serpentine, etc.)
 */
export function getCabinetsInRowMajorOrder(
  geometry: ScreenGridGeometry
): CabinetRect[] {
  return [...geometry.cabinets].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
}

/**
 * Helper: returns cabinets column-by-column (useful for power)
 */
export function getCabinetsInColumnMajorOrder(
  geometry: ScreenGridGeometry
): CabinetRect[] {
  return [...geometry.cabinets].sort((a, b) => {
    if (a.col !== b.col) return a.col - b.col;
    return a.row - b.row;
  });
}
