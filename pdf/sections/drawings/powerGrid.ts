import { ApplicationType } from "@/pdf/types";
import { ScreenGridDefinition } from "../../utils/gridMath";
import {
  mapPowerLinesToGrid,
  PowerGridCell,
} from "../../utils/powerGridMap";
import { PowerLine } from "../../utils/powerModel";

/**
 * Layout tuning (MUST match buildPdf.ts)
 */
const MAX_COLS_PER_BLOCK = 12;

// LETTER page geometry
const PAGE_WIDTH = 612;
const PAGE_MARGIN_LEFT = 30;
const PAGE_MARGIN_RIGHT = 30;

// Safety buffer for borders + padding
const SAFETY_BUFFER = 48;

const SAFE_WIDTH =
  PAGE_WIDTH - PAGE_MARGIN_LEFT - PAGE_MARGIN_RIGHT - SAFETY_BUFFER;

const CABINET_COL_WIDTH = Math.floor(
  SAFE_WIDTH / MAX_COLS_PER_BLOCK
);

/**
 * Capacity-based warning colors (used ONLY in summary row)
 */
function getCapacityFill(capacityPercent: number): string | undefined {
  if (capacityPercent > 80) return "#F8D7DA"; // red-ish
  if (capacityPercent > 60) return "#FFF3CD"; // yellow-ish
  return undefined;
}

/**
 * Fixed color palette for circuit grouping
 * Each circuit (PWR-1, PWR-2, etc) gets ONE color consistently
 */

const CIRCUIT_HUES = [
  210, // blue
  140, // green
  45,  // yellow
  25,  // orange
  0,   // red
  270, // purple
  180, // teal
  320, // magenta (optional)
];
  
function getCircuitColor(index: number): string {
  const hue = (index * 60) % 360; // restrained stepping
  const saturation = 35;         // muted
  const lightness = 88;          // pastel / print-safe

  return hslToHex(hue, saturation, lightness);
}


function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}



/**
 * Slice grid by column range (view-only)
 */
function sliceGridByColumns(
  grid: PowerGridCell[][],
  startCol: number,
  endCol: number
): PowerGridCell[][] {
  return grid.map((row) => row.slice(startCol, endCol));
}

/**
 * Column header row for each block
 */
function buildColumnHeaderRow(startCol: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    text: `Col ${startCol + i + 1}`,
    bold: true,
    fontSize: 7,
    alignment: "center",
    margin: [0, 4, 0, 4],
  }));
}

export function buildPowerGrid(params: {
  gridDef: ScreenGridDefinition;
  powerLines: PowerLine[];
  application: ApplicationType;
}) {
  const { gridDef, powerLines } = params;

  if (!powerLines.length) return [];

  // ─────────────────────────────────────────────
  // CIRCUIT → COLOR LOOKUP
  // ─────────────────────────────────────────────
  const circuitColorMap = new Map<string, string>();

  powerLines.forEach((line, index) => {
    circuitColorMap.set(
      line.lineId,
      getCircuitColor(index)
    );
  });

  // ─────────────────────────────────────────────
// POWER DISTRIBUTION TABLE (WITH HEADERS)
// ─────────────────────────────────────────────
const powerDistributionTable = {
  unbreakable: true,
  table: {
widths: [60, "*", "*", "*", 80, 60, 60],
    body: [
      [
        { text: "PWR-#", bold: true, alignment: "right", vertical: "middle" },
        { text: "Input Voltage", bold: true, alignment: "right" },
        { text: "Circuit Current", bold: true, alignment: "right" },
        { text: "Circuit Max", bold: true, alignment: "right", vertical: "middle" },
        { text: "Circuit Power", bold: true, alignment: "right" },
        { text: "Capacity", bold: true, alignment: "right", vertical: "middle" },
        { text: "Cabinet Qty", bold: true, alignment: "right" },
      ],
      ...powerLines.map((line) => [
        {
          text: line.lineId,
          bold: true,
          fillColor: circuitColorMap.get(line.lineId),
        },
        { text: `${line.voltage} V`, alignment: "right"  },
        { text: `${line.current.toFixed(1)} A`, alignment: "right" },
        { text: `${line.usableCurrent.toFixed(1)} A`, alignment: "right"  },
        { text: `${line.usableWatts.toFixed(1)} W`, alignment: "right"  },  
        { text: `${line.capacityPercent}%`, alignment: "right"  },
        { text: `${line.panelsServed}`, alignment: "right"  },
      ]),
    ],
  },
  layout: "lightHorizontalLines",
};


  // ─────────────────────────────────────────────
  // MAP CIRCUITS → GRID
  // ─────────────────────────────────────────────
  const powerGrid = mapPowerLinesToGrid({
    gridDef,
    powerLines,
  });

  // Sanity check (protects against future regressions)
  if (
    powerGrid.length !== gridDef.rowHeightsMm.length ||
    powerGrid[0]?.length !== gridDef.columnWidthsMm.length
  ) {
    throw new Error(
      "Power grid dimensions do not match screen grid definition"
    );
  }



  // ─────────────────────────────────────────────
  // BUILD SPLIT GRID BLOCKS
  // ─────────────────────────────────────────────
  const totalCols = gridDef.columnWidthsMm.length;
  const gridBlocks: any[] = [];

  for (
    let startCol = 0;
    startCol < totalCols;
    startCol += MAX_COLS_PER_BLOCK
  ) {
    const endCol = Math.min(startCol + MAX_COLS_PER_BLOCK, totalCols);
    const slice = sliceGridByColumns(powerGrid, startCol, endCol);
    const blockColCount = endCol - startCol;
    
    //safety check
    if (blockColCount <= 0) {
      continue;
    }


    gridBlocks.push({
      unbreakable: true,
      stack: [
      {
        text:
          totalCols > MAX_COLS_PER_BLOCK
            ? `Columns ${startCol + 1} – ${endCol}`
            : "",
        fontSize: 9,
        bold: true,
        margin: [0, startCol === 0 ? 0 : 16, 0, 6],
      },
      {
        unbreakable: true,
        table: {
          widths: Array(blockColCount).fill(CABINET_COL_WIDTH),
          body: [
            buildColumnHeaderRow(startCol, blockColCount),
            ...slice.map((row) =>
              row.map((cell) => ({
                stack: [
                  { text: cell.powerLineId, bold: true, fontSize: 8 },
                  { text: `#${cell.order}`, fontSize: 7 },
                ],
                alignment: "center",
                margin: [0, 8, 0, 8],
                fillColor: circuitColorMap.get(cell.powerLineId),
              }))
            ),
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#999",
          vLineColor: () => "#999",
          paddingLeft: () => 2,
          paddingRight: () => 2,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
      },
    ],
    });
  }

  // ─────────────────────────────────────────────
  // FINAL CONTENT
  // ─────────────────────────────────────────────
  return [
    {
      text: "Power Distribution",
      style: "sectionHeader",
      margin: [0, 0, 0, 8],
    },
    powerDistributionTable,
    {
      text: "Power Grid",
      style: "sectionHeader",
      margin: [0, 16, 0, 8],
    },
    ...gridBlocks,
  ];
}
