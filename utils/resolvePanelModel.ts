// utils/resolvePanelModel.ts

export type PanelSpec = {
  model: string;
  maxWattsPerPanel: number;
};

type Application = "installation" | "rental";

type ModelRule = {
  application: Application;
  pixelPitch: number;
  model: string;
  maxWattsPerPanel: number;
};

const MODEL_RULES: ModelRule[] = [
  // Rental
  { application: "rental", pixelPitch: 1.9, model: "REM 1", maxWattsPerPanel: 200 },
  { application: "rental", pixelPitch: 2.9, model: "F2", maxWattsPerPanel: 250 },
  { application: "rental", pixelPitch: 3.9, model: "REM 3 IP", maxWattsPerPanel: 300 },

  // Installation
  { application: "installation", pixelPitch: 1.5, model: "REM Mira 1.5", maxWattsPerPanel: 150 },
  { application: "installation", pixelPitch: 1.9, model: "REM Mira 1.9", maxWattsPerPanel: 150 },
  { application: "installation", pixelPitch: 3.9, model: "REM Mira 3.9", maxWattsPerPanel: 150 },
];

export function resolvePanelModel(params: {
  application: string;
  pixelPitch: number;
}): PanelSpec | undefined {
  const application = params.application.trim().toLowerCase() as Application;

  const rule = MODEL_RULES.find(
    (r) =>
      r.application === application &&
      Math.abs(r.pixelPitch - params.pixelPitch) < 0.01
  );

  if (!rule) {
    return undefined;
  }

  return {
    model: rule.model,
    maxWattsPerPanel: rule.maxWattsPerPanel,
  };
}


