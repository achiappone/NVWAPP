// pdf/sections/drawings/buildScreenGrid.ts

import { buildInstallationGridFromHardware } from "../../utils/gridBuilder";
import { buildScreenGridGeometry } from "../../utils/gridMath";

export function buildScreenGrid({
  screen,
  application,
}: {
  screen: {
    hardware: {
      width: number;  // meters
      height: number; // meters
    };
  };
  application: string;
}) {
  const { hardware } = screen;

  const gridDef = buildInstallationGridFromHardware({
    width: hardware.width,
    height: hardware.height,
    application: application,
  });

  const geometry = buildScreenGridGeometry(gridDef);

  // ---- PDF sizing ----
  const MM_TO_PT = 2.83;

  const PAGE_WIDTH_PT = 612;   // LETTER
  const PAGE_HEIGHT_PT = 792;

  const MARGIN_LEFT = 40;
  const MARGIN_RIGHT = 40;
  const MARGIN_TOP = 60;
  const MARGIN_BOTTOM = 60;

  const usableWidthPt = PAGE_WIDTH_PT - MARGIN_LEFT - MARGIN_RIGHT;
  const usableHeightPt = PAGE_HEIGHT_PT - MARGIN_TOP - MARGIN_BOTTOM;

  const gridWidthPt = geometry.totalWidthMm * MM_TO_PT;
  const gridHeightPt = geometry.totalHeightMm * MM_TO_PT;

  const scale =
    Math.min(usableWidthPt / gridWidthPt, usableHeightPt / gridHeightPt) * 0.9;

  // ✅ rendered height (USED FOR LEGEND SPACING)
  const renderedGridHeightPt = gridHeightPt * scale;

  // Center horizontally
  const offsetXInContent = (usableWidthPt - gridWidthPt * scale) / 2;

  // Fixed vertical anchor under header
  const GRID_TOP_Y_PAGE = MARGIN_TOP + 60;

  const gridOriginXPage = MARGIN_LEFT + offsetXInContent;
  const gridOriginYPage = GRID_TOP_Y_PAGE;

  // ---- RECTANGLES ----
  const rects = geometry.cabinets.map((cab) => {
    const x = gridOriginXPage + cab.x * MM_TO_PT * scale;
    const y = gridOriginYPage + cab.y * MM_TO_PT * scale;
    const w = cab.width * MM_TO_PT * scale;
    const h = cab.height * MM_TO_PT * scale;

    return {
      type: "rect",
      x,
      y,
      w,
      h,
      lineWidth: 1,
    };
  });

  // ---- LABELS ----
  const labels = geometry.cabinets.map((cab) => {
    const x = gridOriginXPage + cab.x * MM_TO_PT * scale;
    const y = gridOriginYPage + cab.y * MM_TO_PT * scale;
    const w = cab.width * MM_TO_PT * scale;
    const h = cab.height * MM_TO_PT * scale;

    return {
      text: `${cab.col + 1}-${cab.row + 1}`,
      fontSize: 8,
      bold: true,
      color: "#000000",
      absolutePosition: {
        x: x + w / 2 - 10,
        y: y + h / 2 - 4,
      },
    };
  });

  // ---- FINAL OUTPUT ----
  return [
    { text: "Screen Layout", style: "sectionHeader" },

    // grid (absolute)
    {
      canvas: rects,
      absolutePosition: { x: 0, y: 0 },
    },

    // labels (absolute)
    ...labels,

    // spacer so flow continues BELOW the grid
    {
      text: "",
      margin: [0, renderedGridHeightPt + 40, 0, 0],
    },

    // legend
    {
      text: "Cabinets labeled by column and vertical order (top to bottom)",
      fontSize: 8,
      italics: true,
      color: "#444444",
      alignment: "center",
    }
  ];
}
