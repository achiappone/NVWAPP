// pdf/sections/drawings/powerGrid.ts

import { ApplicationType } from "@/pdf/types";
import { ScreenGridDefinition } from "../../utils/gridMath";
import { mapPowerLinesToGrid } from "../../utils/powerGridMap";
import { PowerLine } from "../../utils/powerModel";

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
const CIRCUIT_COLORS = [
  "#F5F5F5",
  "#EAEAEA",
  "#E8F4FD",
  "#FFF3CD",
  "#F3E8FF",
  "#E6F4EA",
];

export function buildPowerGrid(params: {
  gridDef: ScreenGridDefinition;
  powerLines: PowerLine[];
  application: ApplicationType;
}) {
  const { gridDef, powerLines, application } = params;

  if (!powerLines.length) return [];

  // ─────────────────────────────────────────────
  // POWER DISTRIBUTION SUMMARY
  // ─────────────────────────────────────────────
  const summaryCells = powerLines.map((line) => ({
    stack: [
      { text: line.lineId, bold: true, fontSize: 9 },
      { text: `${line.voltage} V`, fontSize: 8 },
      {
        text: `${line.current.toFixed(1)} A / ${line.maxCurrent} A`,
        fontSize: 8,
      },
      {
        text: `${line.capacityPercent}%`,
        fontSize: 8,
      },
    ],
    alignment: "center",
    margin: [4, 6, 4, 6],
    fillColor: getCapacityFill(line.capacityPercent),
  }));

  // ─────────────────────────────────────────────
  // MAP CIRCUITS → GRID
  // ─────────────────────────────────────────────
  const powerGrid = mapPowerLinesToGrid({
    gridDef,
    powerLines,
  });

    //sanity check
    if (
    powerGrid.length !== gridDef.rowHeightsMm.length ||
    powerGrid[0]?.length !== gridDef.columnWidthsMm.length
    ) {
      throw new Error("Power grid dimensions do not match screen grid definition");
    }

  // ─────────────────────────────────────────────
  // CIRCUIT → COLOR LOOKUP
  // ─────────────────────────────────────────────
  const circuitColorMap = new Map<string, string>();

  powerLines.forEach((line, index) => {
    circuitColorMap.set(
      line.lineId,
      CIRCUIT_COLORS[index % CIRCUIT_COLORS.length]
    );
  });

  // ─────────────────────────────────────────────
  // GRID SCALING (prevent overflow)
  // ─────────────────────────────────────────────
  const colCount = gridDef.columnWidthsMm.length;


  // ─────────────────────────────────────────────
  // GRID TABLE
  // ─────────────────────────────────────────────
  const gridTable = {
    table: {
      widths: Array(colCount).fill("*"),
      body: powerGrid.map((row) =>
        row.map((cell) => ({
          stack: [
            { text: cell.powerLineId, bold: true, fontSize: 8 },
            { text: `#${cell.order}`, fontSize: 7 },
          ],
          alignment: "center",
          margin: [0, 10, 0, 10],
          fillColor: circuitColorMap.get(cell.powerLineId),
        }))
      ),
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => "#999",
      vLineColor: () => "#999",
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  };

  // ─────────────────────────────────────────────
  // FINAL CONTENT
  // ─────────────────────────────────────────────
  return [
    {
      text: "Power Distribution",
      style: "sectionHeader",
      margin: [0, 0, 0, 8],
    },
    {
      table: {
        widths: Array(summaryCells.length).fill("*"),
        body: [summaryCells],
      },
      layout: "lightHorizontalLines",
    },
    {
      text: "Power Grid",
      style: "sectionHeader",
      margin: [0, 16, 0, 8],
    },
    gridTable,
  ];
}
