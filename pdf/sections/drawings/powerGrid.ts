// pdf/sections/drawings/powerGrid.ts

import { PowerLine } from "../../utils/powerModel";

function getCapacityFill(capacityPercent: number): string | undefined {
  if (capacityPercent > 75) return "#EAEAEA";
  if (capacityPercent > 50) return "#F5F5F5";
  return undefined;
}

export function buildPowerGrid(powerLines: PowerLine[]) {
  if (!powerLines.length) return [];

  // Build table rows (1 cell per power line)
  const cells = powerLines.map(line => ({
    stack: [
      { text: line.lineId, bold: true, fontSize: 9 },
      { text: `${line.voltage}V`, fontSize: 8 },
      {
        text: `${line.current.toFixed(1)}A / ${line.maxCurrent}A`,
        fontSize: 8,
      },
      {
        text: `${line.capacityPercent}%`,
        fontSize: 8,
      },
    ],
    alignment: "center",
    margin: [2, 4, 2, 4],
    fillColor: getCapacityFill(line.capacityPercent),
  }));

  return [
    {
      text: "Power Distribution",
      style: "sectionHeader",
      margin: [0, 0, 0, 8],
    },
    {
      table: {
        widths: Array(cells.length).fill("*"),
        body: [cells],
      },
      layout: "lightHorizontalLines",
    },
  ];
}
