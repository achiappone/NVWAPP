// domain/videoSourceCalculations.ts

export type VideoOutputFormat = "HD (1920x1080)" | "4K (3840x2160)";

const OUTPUT_RESOLUTIONS = {
  "HD (1920x1080)": { width: 1920, height: 1080 },
  "4K (3840x2160)": { width: 3840, height: 2160 },
};

export function calculateMediaServerOutputs(params: {
  totalWidthPx: number;
  totalHeightPx: number;
  outputFormat: VideoOutputFormat;
}) {
  const output = OUTPUT_RESOLUTIONS[params.outputFormat];

  const horizontalOutputs = Math.ceil(
    params.totalWidthPx / output.width
  );

  const verticalOutputs = Math.ceil(
    params.totalHeightPx / output.height
  );

  return {
    outputs: horizontalOutputs * verticalOutputs,
    horizontalOutputs,
    verticalOutputs,
  };
}
