// pdf/sections/drawings/signalGrid.ts

import { GRID_COLORS } from "@/domain/gridColors";
import { lightenHexColor } from "../../utils/colorUtils";

export function buildSignalGridSection(params: {
  
  rows: number;
  cols: number;
  cabinets: { row: number; col: number }[];
  cabinetsPerPort: number[];
  cabinetPortAssignments: number[];
}) {
  const {
    rows,
    cols,
    cabinets,
    cabinetsPerPort,
    cabinetPortAssignments,
  } = params;

  // ─────────────────────────────────────────────
  // PORT SUMMARY TABLE
  // ─────────────────────────────────────────────
  const portSummaryTable = {
    table: {
      widths: ["*", "*"],
      body: [
        [
          { text: "Signal Port", style: "tableHeader" },
          { text: "Cabinets", style: "tableHeader" },
        ],
        ...cabinetsPerPort.map((count, i) => [
          `Port ${i + 1}`,
          `${count}`,
        ]),
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 12],
  };

  // ─────────────────────────────────────────────
  // BUILD 2D GRID
  // ─────────────────────────────────────────────
  const grid: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "")
  );

  cabinets.forEach((cab, i) => {
    const port = cabinetPortAssignments[i];
    grid[cab.row][cab.col] = `P${port + 1}`;
  });

  const gridBody = grid.map(row =>
    row.map(cell => {
      if (!cell) return "";

      const portIndex = Number(cell.slice(1)) - 1;
      const baseColor = GRID_COLORS[portIndex % GRID_COLORS.length];

      return {
        text: cell,
        alignment: "center",
        color: "#000000",
        fillColor: lightenHexColor(baseColor, 0.65),
        fontSize: 10,
        bold: true,
        margin: [0, 6, 0, 6],
      };
    })
  );

  const signalGridTable = {
    table: {
      widths: Array(cols).fill("*"),
      body: gridBody,
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
    },
  };

  return [
  // SECTION HEADER
  { text: "Signal Distribution", style: "sectionHeader" },

  // SUMMARY TABLE
  portSummaryTable,

  // SPACING
  { text: "", margin: [0, 6] },

  // VISUAL GRID LABEL (matches Power Grid)
  {
    text: "Signal Grid",
    style: "subSectionHeader",
    margin: [0, 6, 0, 4],
  },

  // GRID
  signalGridTable,
];

}
