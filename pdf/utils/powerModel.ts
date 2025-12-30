// pdf/utils/powerModel.ts

export type PowerLine = {
  lineId: string;
  order: number;
  panelsServed: number;

  voltage: number;
  totalWatts: number;
  current: number;

  breakerCurrent: number;
  usableCurrent: number;
  usableWatts: number;

  capacityPercent: number; // 0 – 100 (based on usable amps)
};

const DEFAULT_MAX_CURRENT = 16;
const DEFAULT_SAFETY_FACTOR = 0.9;

export function buildPowerLines(params: {
  totalPanels: number;              // <-- CHANGED: total cabinet count
  panelMaxWatts: number;
  inputVoltage: 120 | 208 | 230;
  maxCircuitCurrent?: number;       // breaker rating (e.g. 16A)
  safetyFactor?: number;            // default 0.9 (90% derating continuous load)

}): PowerLine[] {
  const {
    totalPanels,
    panelMaxWatts,
    inputVoltage,
    maxCircuitCurrent = DEFAULT_MAX_CURRENT,
    safetyFactor,
  } = params;

  const effectiveSafetyFactor =
  safetyFactor !== undefined ? safetyFactor : DEFAULT_SAFETY_FACTOR;

  const usableCurrent = maxCircuitCurrent * effectiveSafetyFactor;
  const usableWatts = usableCurrent * inputVoltage;

  console.log("Power calc:", {
  breaker: maxCircuitCurrent,
  safetyFactor: effectiveSafetyFactor,
  usableCurrent,
  usableWatts,
});

  const maxPanelsPerCircuit = Math.max(
    1, 
    Math.floor(usableWatts / panelMaxWatts)
  );

  const lines: PowerLine[] = [];

  let remaining = totalPanels;
  let order = 1;

  while (remaining > 0) {
    const panelsOnThisCircuit = Math.min(maxPanelsPerCircuit, remaining);

    const totalWatts = panelsOnThisCircuit * panelMaxWatts;
    const current = totalWatts / inputVoltage;

    const capacityPercent = Math.round((current / usableCurrent) * 100);

    lines.push({
      lineId: `PWR-${order}`,
      order,
      panelsServed: panelsOnThisCircuit,
      voltage: inputVoltage,
      totalWatts,
      current,
      breakerCurrent: maxCircuitCurrent,
      usableCurrent,
      usableWatts,
      capacityPercent,
    });

    remaining -= panelsOnThisCircuit;
    order++;
  }

  return lines;
}
