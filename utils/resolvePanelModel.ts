// utils/resolvePanelModel.ts

type Application = "installation" | "rental";

type ModelRule = {
  application: Application;
  pixelPitch: number;
  model: string;
};

const MODEL_RULES: ModelRule[] = [
  // Rental
  { application: "rental", pixelPitch: 2.9, model: "F2" },
  { application: "rental", pixelPitch: 1.9, model: "REM 1" },
  { application: "rental", pixelPitch: 3.9, model: "REM 3 IP" },

  // Installation
  { application: "installation", pixelPitch: 1.5, model: "REM Mira 1.5" },
  { application: "installation", pixelPitch: 1.9, model: "REM Mira 1.9" },
  { application: "installation", pixelPitch: 3.9, model: "REM Mira 3.9" },
];

export function resolvePanelModel(params: {
  application: string;
  pixelPitch: number;
}): string | undefined {
  const application = params.application.trim().toLowerCase() as Application;

  const rule = MODEL_RULES.find(
    (r) =>
      r.application === application &&
      Math.abs(r.pixelPitch - params.pixelPitch) < 0.01
  );

  return rule?.model;
}
