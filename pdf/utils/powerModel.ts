// pdf/utils/powerModel.ts

export type PowerLine = {
  lineId: string;
  order: number;
  panelsServed: number;

  voltage: number;
  totalWatts: number;
  current: number;
  maxCurrent: number;

  capacityPercent: number; // 0 – 100
};

const DEFAULT_MAX_CURRENT = 16;

export function buildPowerLines(params: {
  panelsPerLine: number[];
  panelMaxWatts: number;
  inputVoltage: 120 | 208 | 230;
  maxCircuitCurrent?: number;
}): PowerLine[] {
  const {
    panelsPerLine,
    panelMaxWatts,
    inputVoltage,
    maxCircuitCurrent = DEFAULT_MAX_CURRENT,
  } = params;

  return panelsPerLine.map((panelCount, index) => {
    const totalWatts = panelCount * panelMaxWatts;
    const current = totalWatts / inputVoltage;
    const capacityPercent = Math.round(
      (current / maxCircuitCurrent) * 100
    );

    return {
      lineId: `PWR-${index + 1}`,
      order: index + 1,
      panelsServed: panelCount,

      voltage: inputVoltage,
      totalWatts,
      current,
      maxCurrent: maxCircuitCurrent,
      capacityPercent,
    };
  });
}
