// pdf/sections/drawings/systemGrid.ts

//function to draw rounded corner boxes around system grid items
function roundedBox(
  width: number,
  height: number,
  radius = 6,
  strokeColor = "#999999",
  fillColor: string | null = null
) {
  return {
    canvas: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: width,
        h: height,
        r: radius, // ← rounded corners
        lineWidth: 0.8,
        lineColor: strokeColor,
        color: fillColor ?? undefined,
      },
    ],
  };
}


export function buildSystemGrid(systemGrid: {
  // Optional: if you later pass this in, it will show the correct number like Preview.
  // If not provided, we default to 1.
  mediaServerOutputs?: { outputs: number };

  processors: {
    id: string;
    label: string;
    model: string;
    outputs: {
      outputIndex: number;
      cabinetGroup: {
        width: number;
        height: number;
        cabinetCount: number;
      };
    }[];
    cabinetOutputAssignments: {
      row: number;
      col: number;
      outputIndex: number;
    }[];
  }[];
}) {
  const content: any[] = [];

  // ─────────────────────────────────────────────────────────────
  // 1) TEXT DISTRIBUTION OVERVIEW
  // ─────────────────────────────────────────────────────────────
  content.push({
    text: "System Distribution",
    style: "sectionHeader",
    margin: [0, 0, 0, 10],
  });

  systemGrid.processors.forEach((processor) => {
    content.push({
      text: processor.label,
      // NOTE: your styles file uses "subSectionHeader" (capital S)
      style: "subSectionHeader",
      margin: [0, 6, 0, 4],
    });

    // Distribution text (sorted by output index)
    [...processor.outputs]
      .sort((a, b) => a.outputIndex - b.outputIndex)
      .forEach((output) => {
        content.push({
          style: "specValue",
          columns: [
            {
              width: 60,
              text: `Out ${output.outputIndex + 1}`,
              bold: true,
            },
            {
              text: `${output.cabinetGroup.cabinetCount} cabinet(s)`,
            },
          ],
        });
      });

    // spacing between processors in the text overview
    content.push({ text: "", margin: [0, 4, 0, 0] });
  });

  // ─────────────────────────────────────────────────────────────
  // 2) SYSTEM GRID DIAGRAM
  //    Media Server  ▶  Processor columns
  // ─────────────────────────────────────────────────────────────
  content.push({
    text: "System Grid",
    style: "sectionHeader",
    margin: [0, 10, 0, 6],
  });

  const mediaServerOutputsCount =
    systemGrid.mediaServerOutputs?.outputs ?? 1;

  // Helper: draw a bordered "box" like the Preview card (stop using this)
  const boxedStack = (stack: any[]) => ({
    table: {
      widths: ["*"],
      body: [[{ stack }]],
    },
    layout: {
      hLineWidth: () => 0.8,
      vLineWidth: () => 0.8,
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  });

  const MEDIA_BOX_WIDTH = 130;
  const MEDIA_BOX_HEIGHT = 60;
  // Media Server column (left)
  const mediaServerColumn = {
    width: MEDIA_BOX_WIDTH,
    stack: [
      roundedBox(MEDIA_BOX_WIDTH, MEDIA_BOX_HEIGHT, 6,),
        {
        stack: [
          {
            text: "Media Server",
            style: "subSectionHeader",
            alignment: "center",
            margin: [0, 6, 0, 2],//[] [left, top, right, bottom]
          },
          {
            text: `Output(s): ${mediaServerOutputsCount}`,
            style: "specValue",
            alignment: "center",
          },
        ],
        margin: [0, -MEDIA_BOX_HEIGHT + 6, 0, 0],//[] [left, top, right, bottom]
      },
    ],
  };

  // Big arrow column
  const arrowColumn = {
    width: 30,
    stack: [
      {
        text: "-->",
        fontSize: 18,
        alignment: "center",
        margin: [0, 10, 0, 0],//[] [left, top, right, bottom]
        bold: true,
      },
    ],
  };

  //processor constants + height calculation
  const PROCESSOR_BOX_WIDTH = 170;
  const PROCESSOR_ROW_HEIGHT = 18;
  const PROCESSOR_HEADER_HEIGHT = 24;

  // Processor columns (one per processor, horizontally)
  const processorColumns = systemGrid.processors.map((processor) => {
    const rows = [...processor.outputs]
      .sort((a, b) => a.outputIndex - b.outputIndex)
      .map((output) => ({
        columns: [
          {
            width: 45,
            text: `Out ${output.outputIndex + 1}`,
            bold: true,
          },
          {
            width: 16,
            text: "->",
            alignment: "center",
            bold: true,
          },
          {
            text: `${output.cabinetGroup.cabinetCount} cabinet(s)`,
          },
        ],
        style: "specValue",
        margin: [10, 2, 0, 2],//[] left, top, right, bottom
      }));

    return {
      width: PROCESSOR_BOX_WIDTH,
      stack: [
        (() => {
          const boxHeight =
            PROCESSOR_HEADER_HEIGHT +
            rows.length * PROCESSOR_ROW_HEIGHT +
            8; // 8 for padding
        
          //rounded box
          return {
            stack: [
              roundedBox(PROCESSOR_BOX_WIDTH, boxHeight, 6),

             //content overlayed on top of the box
            {
              stack: [
                {
                  text: processor.label,
                  style: "subSectionHeader",
                  alignment: "left",
                  margin: [0, 6, 0, 0],//[] [left, top, right, bottom]

                },
                ...rows,
              ],
              margin: [6, -boxHeight + 6, 0, 0],//[] [left, top, right, bottom]

            },
          ],
        };
      })(),
    ],
    }
  });

  content.push({
    columns: [mediaServerColumn, arrowColumn, ...processorColumns],
    columnGap: 10,
    margin: [0, 0, 0, 0],
  });

  return content;
}
