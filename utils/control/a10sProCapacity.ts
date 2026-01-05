// utils/control/a10sProCapacity.ts

// -----------------------------------------------------------------------------
// Types (driven by controlled UI dropdowns)
// -----------------------------------------------------------------------------

export type BitDepth = 8 | 10 | 12;

export type FrameRateHz =
  | 24
  | 25
  | 30
  | 50
  | 60
  | 120
  | 144
  | 240;

// -----------------------------------------------------------------------------
// A10s Pro – Max pixels per output port
// Source: Manufacturer documentation
// -----------------------------------------------------------------------------

export const A10S_PRO_PIXELS_PER_PORT: Record<
  FrameRateHz,
  Record<BitDepth, number>
> = {
  24: { 8: 1649306, 10: 1236979, 12: 824653 },
  25: { 8: 1583333, 10: 1187500, 12: 791667 },
  30: { 8: 1319444, 10: 989583,  12: 659722 },
  50: { 8: 791667,  10: 593750,  12: 395833 },
  60: { 8: 659722,  10: 494792,  12: 329861 },
  120:{ 8: 329861,  10: 247396,  12: 164931 },
  144:{ 8: 274884,  10: 206163,  12: 137442 },
  240:{ 8: 164931,  10: 123698,  12: 82465  },
};

// -----------------------------------------------------------------------------
// Simple capacity lookup
// -----------------------------------------------------------------------------

export function getA10sProPixelsPerPort(
  frameRateHz: FrameRateHz,
  bitDepth: BitDepth
): number {
  return A10S_PRO_PIXELS_PER_PORT[frameRateHz][bitDepth];
}

// -----------------------------------------------------------------------------
// Control sizing + utilization calculation
// -----------------------------------------------------------------------------

export function calculateA10sProControlLoad(input: {
  totalScreenPixels: number;
  cabinetPixels: number;
  frameRateHz: FrameRateHz;
  bitDepth: BitDepth;
  portsPerProcessor: number;
}) {
  const {
    totalScreenPixels,
    cabinetPixels,
    frameRateHz,
    bitDepth,
    portsPerProcessor,
  } = input;

  const pixelsPerPort = getA10sProPixelsPerPort(frameRateHz, bitDepth);

  const portsRequired = Math.ceil(
    totalScreenPixels / pixelsPerPort
  );

  const cabinetsPerPort = Math.floor(
    pixelsPerPort / cabinetPixels
  );

  const pixelsUsedPerPort = cabinetsPerPort * cabinetPixels;

  const portUtilizationPercent =
    (pixelsUsedPerPort / pixelsPerPort) * 100;

  const totalAvailablePixels =
    portsRequired * pixelsPerPort;

  const overallUtilizationPercent =
    (totalScreenPixels / totalAvailablePixels) * 100;

  const processorsRequired = Math.ceil(
    portsRequired / portsPerProcessor
  );

  return {
    // capacity
    pixelsPerPort,
    pixelsUsedPerPort,

    // port loading
    cabinetsPerPort,
    portsRequired,

    // utilization
    portUtilizationPercent,
    overallUtilizationPercent,

    // hardware
    processorsRequired,
  };
}
