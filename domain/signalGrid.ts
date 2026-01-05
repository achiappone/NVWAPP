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

  // Group cabinets by column
  const columns = new Map<number, { index: number; row: number }[]>();

  cabinets.forEach((cab, index) => {
    if (!columns.has(cab.col)) {
      columns.set(cab.col, []);
    }
    columns.get(cab.col)!.push({ index, row: cab.row });
  });

  // Sort columns left → right
  const sortedColumns = [...columns.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, cabs]) =>
      cabs.sort((a, b) =>
        direction === "top-down"
          ? a.row - b.row
          : b.row - a.row
      )
    );

  const assignments = new Array(cabinets.length).fill(0);

  let portIndex = 0;
  let assignedOnPort = 0;
  let portCapacity = cabinetsPerPort[portIndex] ?? 0;

  for (const column of sortedColumns) {
    for (const cab of column) {
      // Move to next port if capacity reached
      if (assignedOnPort >= portCapacity) {
        portIndex++;
        assignedOnPort = 0;
        portCapacity = cabinetsPerPort[portIndex] ?? 0;
      }

      assignments[cab.index] = portIndex;
      assignedOnPort++;
    }
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
