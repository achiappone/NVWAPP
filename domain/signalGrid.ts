// domain/signalGrid.ts

export type SignalGridParams = {
  totalCabinets: number;
  portsRequired: number;
};

export type SignalGridResult = {
  portsUsed: number;
  cabinetsPerPort: number[];
};

export function buildSignalGrid(
  params: SignalGridParams
): SignalGridResult {
  const { totalCabinets, portsRequired } = params;

  // Base number of cabinets per port
  const base = Math.floor(totalCabinets / portsRequired);

  // Extra cabinets to distribute one-by-one
  const remainder = totalCabinets % portsRequired;

  const cabinetsPerPort = Array.from(
    { length: portsRequired },
    (_, index) => base + (index < remainder ? 1 : 0)
  );

  return {
    portsUsed: portsRequired,
    cabinetsPerPort,
  };
}

export function assignCabinetsToPortsVertical(params: {
  cabinets: { row: number; col: number }[];
  cabinetsPerPort: number[];
  direction: "top-down" | "bottom-up";
}): number[] {
  const { cabinets, cabinetsPerPort, direction } = params;

  // 1. Group cabinets by column
  const columns = new Map<number, { index: number; row: number }[]>();

  cabinets.forEach((cab, index) => {
    if (!columns.has(cab.col)) {
      columns.set(cab.col, []);
    }
    columns.get(cab.col)!.push({ index, row: cab.row });
  });

  // 2. Build continuous traversal (serpentine)
  const traversal: number[] = [];

  const sortedColumns = [...columns.entries()].sort(
    ([a], [b]) => a - b
  );

  sortedColumns.forEach(([, columnCabs], colIdx) => {
    const goingDown =
      direction === "top-down"
        ? colIdx % 2 === 0
        : colIdx % 2 !== 0;

    const ordered = [...columnCabs].sort((a, b) =>
      goingDown ? a.row - b.row : b.row - a.row
    );

    for (const cab of ordered) {
      traversal.push(cab.index);
    }
  });

  // 3. Assign ports using traversal cursor
  const assignments = new Array(cabinets.length).fill(0);

  let portIndex = 0;
  let usedOnPort = 0;
  let portCapacity = cabinetsPerPort[portIndex] ?? 0;

  for (const cabinetIndex of traversal) {
    if (usedOnPort >= portCapacity) {
      portIndex++;
      usedOnPort = 0;
      portCapacity = cabinetsPerPort[portIndex] ?? 0;
    }

    assignments[cabinetIndex] = portIndex;
    usedOnPort++;
  }

  return assignments;
}

export function assignCabinetsToPorts(params: {
  totalCabinets: number;
  portsRequired: number;
}): number[] {
  const { totalCabinets, portsRequired } = params;

  const base = Math.floor(totalCabinets / portsRequired);
  const remainder = totalCabinets % portsRequired;

  const assignments: number[] = [];

  let portIndex = 0;
  let assignedToPort = 0;
  let maxForPort = base + (portIndex < remainder ? 1 : 0);

  for (let i = 0; i < totalCabinets; i++) {
    assignments.push(portIndex);
    assignedToPort++;

    if (assignedToPort >= maxForPort) {
      portIndex++;
      assignedToPort = 0;
      maxForPort =
        base + (portIndex < remainder ? 1 : 0);
    }
  }

  return assignments;
}
