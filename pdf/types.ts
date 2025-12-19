// pdf/types.ts

export type ScreenExportData = {
  pixelPitch: number;
  widthMeters: number;
  heightMeters: number;
  aspectRatio: string;

  // grid-relevant fields
  panelsWide: number;
  panelsHigh: number;
};

export type ControlExportData = {
  processorModel: string;
  sourceResolution: string;
  refreshRate: number;
  bitDepth: number;
  hdr: boolean;
};

export type CablesExportData = {
  fiberRequired: boolean;
  powerLinking: string;
  signalLinking: string;
};

export type ExportConfig = {
  screen: ScreenExportData;
  control: ControlExportData;
  cables: CablesExportData;
};
