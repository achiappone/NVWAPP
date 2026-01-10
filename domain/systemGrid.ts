// domain/systemGrid.ts

export function calculateSystemGrid(
  cabinets: { row: number; col: number }[],
  cabinetPortAssignments: number[],
  processor: {
    id: string;
    label: string;
    model: string;
  }
) {
  const outputs = new Map<
    number,
    {
      minRow: number;
      maxRow: number;
      minCol: number;
      maxCol: number;
      count: number;
    }
  >();

  cabinets.forEach((cab, index) => {
    const outputIndex = cabinetPortAssignments[index];

    if (!outputs.has(outputIndex)) {
      outputs.set(outputIndex, {
        minRow: cab.row,
        maxRow: cab.row,
        minCol: cab.col,
        maxCol: cab.col,
        count: 0,
      });
    }

    const g = outputs.get(outputIndex)!;

    g.minRow = Math.min(g.minRow, cab.row);
    g.maxRow = Math.max(g.maxRow, cab.row);
    g.minCol = Math.min(g.minCol, cab.col);
    g.maxCol = Math.max(g.maxCol, cab.col);
    g.count += 1;
  });

  return {
    processors: [
      {
        ...processor,
        outputs: Array.from(outputs.entries()).map(
          ([outputIndex, g]) => ({
            outputIndex,
            cabinetGroup: {
              width: g.maxCol - g.minCol + 1,
              height: g.maxRow - g.minRow + 1,
              cabinetCount: g.count,
            },
          })
        ),

        //added for system grid
        cabinetOutputAssignments: cabinets.map((cab, index) => ({
          row: cab.row,
          col: cab.col,
          outputIndex: cabinetPortAssignments[index],
        })),
      },
    ],
  };
}
