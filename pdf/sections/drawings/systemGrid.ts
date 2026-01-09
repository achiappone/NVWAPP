// pdf/sections/drawings/systemGrid.ts

export function buildSystemGrid(systemGrid: {
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
  }[];
}) {
  const content: any[] = [];

  content.push({
    text: "System Grid",
    style: "sectionHeader",
    margin: [0, 0, 0, 10],
  });

  systemGrid.processors.forEach((processor) => {
    content.push({
      text: `${processor.label}`,
      style: "subsectionHeader",
      margin: [0, 10, 0, 6],
    });

    processor.outputs.forEach((output) => {
      content.push({
        columns: [
          {
            width: 60,
            text: `Out ${output.outputIndex + 1}`,
            bold: true,
          },
          {
            text: `${output.cabinetGroup.width} × ${output.cabinetGroup.height} (${output.cabinetGroup.cabinetCount})`,
          },
        ],
        margin: [10, 2, 0, 2],
      });
    });
  });

  return content;
}
