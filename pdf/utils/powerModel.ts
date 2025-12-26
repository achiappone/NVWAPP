// pdf/utils/powerModel.ts

export type PowerLine = {
  lineId: string;
  order: number;
  panelsServed: number;

  voltage: number;
  totalWatts: number;
  current: number;
  maxCurrent: number;

  capacityPercent: number; // 0 – 100 (based on usable amps)
};

const DEFAULT_MAX_CURRENT = 16;
const DEFAULT_SAFETY_FACTOR = 0.8;

export function buildPowerLines(params: {
  totalPanels: number;              // <-- CHANGED: total cabinet count
  panelMaxWatts: number;
  inputVoltage: 120 | 208 | 230;
  maxCircuitCurrent?: number;       // breaker rating (e.g. 16A)
  safetyFactor?: number;            // default 0.8
}): PowerLine[] {
  const {
    totalPanels,
    panelMaxWatts,
    inputVoltage,
    maxCircuitCurrent = DEFAULT_MAX_CURRENT,
    safetyFactor = DEFAULT_SAFETY_FACTOR,
  } = params;

  const usableAmps = maxCircuitCurrent * safetyFactor;
  const usableWatts = usableAmps * inputVoltage;

  const maxPanelsPerCircuit = Math.max(1, Math.floor(usableWatts / panelMaxWatts));

  const lines: PowerLine[] = [];

  let remaining = totalPanels;
  let order = 1;

  while (remaining > 0) {
    const panelsOnThisCircuit = Math.min(maxPanelsPerCircuit, remaining);

    const totalWatts = panelsOnThisCircuit * panelMaxWatts;
    const current = totalWatts / inputVoltage;

    const capacityPercent = Math.round((current / usableAmps) * 100);

    lines.push({
      lineId: `PWR-${order}`,
      order,
      panelsServed: panelsOnThisCircuit,
      voltage: inputVoltage,
      totalWatts,
      current,
      maxCurrent: usableAmps,
      capacityPercent,
    });

    remaining -= panelsOnThisCircuit;
    order++;
  }

  return lines;
}
