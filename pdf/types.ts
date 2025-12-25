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

export type PowerConfig = {
  inputVoltage: 120 | 208 | 230;
};

export type ScreenPowerSpec = {
  maxWattsPerPanel: number;
};

export type ExportDocument = {
  meta: {
    app: string;
    version: string;
    projectId: string;
    exportedAt: string;
    projectName: string;
    modelName: string;
    notes?: string;
  };

  project: {
    id: string;
    name: string;
    application: string;
    createdAt: string;

    screens: {
      label: string;

      hardware: ScreenExportData & ScreenPowerSpec;

      control: ControlExportData;

      cables: CablesExportData & PowerConfig;
    }[];
  };
};
