// pdf/sections/coverSection.ts

type CoverSectionData = {
  projectName: string;
  wallLabel: string;
  pixelPitch: number;
  widthMeters: number;
  heightMeters: number;
  aspectRatio: string;
  exportDate: string;
  notes?: string;
  logoBase64?: string;
};

export function buildCoverSection(data: CoverSectionData) {
  return {
    stack: [
      data.logoBase64
        ? {
            image: data.logoBase64,
            width: 150,
            margin: [0, 0, 0, 30],
          }
        : {},

      {
        text: data.projectName,
        fontSize: 28,
        bold: true,
        margin: [0, 0, 0, 12],
      },

      {
        text: data.wallLabel,
        fontSize: 16,
        italics: true,
        margin: [0, 0, 0, 30],
      },

      {
        stack: [
          { text: `Pixel Pitch: ${data.pixelPitch} mm`, margin: [0, 0, 0, 6] },
          {
            text: `Screen Size: ${data.widthMeters} m × ${data.heightMeters} m`,
            margin: [0, 0, 0, 6],
          },
          { text: `Aspect Ratio: ${data.aspectRatio}` },
        ],
        margin: [0, 0, 0, 30],
      },

      data.notes
        ? {
            text: data.notes,
            margin: [0, 0, 0, 30],
          }
        : {},

      {
        text: `Exported: ${data.exportDate}`,
        fontSize: 9,
        color: "#666666",
      },
    ],
    pageBreak: "after",
  };
}
