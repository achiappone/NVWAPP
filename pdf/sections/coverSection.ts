// pdf/sections/coverSection.ts

type CoverSectionData = {
  projectName: string;
  screens: {
    label: string;
  }[];
  exportDate: string;
  logoBase64?: string;
  notes?: string;
};

export function buildCoverSection(data: CoverSectionData) {
  return {
    stack: [
      // Logo (centered)
      data.logoBase64
        ? {
            image: data.logoBase64,
            width: 150,
            alignment: "center",
            margin: [0, 0, 0, 30],
          }
        : {},

      // Project name (centered)
      {
        text: data.projectName,
        fontSize: 28,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 12],
      },

      // Subtitle
      {
        text: "Video Wall Configuration Summary",
        fontSize: 14,
        italics: true,
        alignment: "center",
        margin: [0, 0, 0, 24],
      },

      // Screen list summary
      {
        ul: data.screens.map((s) => s.label),
        alignment: "center",
        margin: [0, 0, 0, 30],
      },

      // Optional notes
      data.notes
        ? {
            text: data.notes,
            alignment: "center",
            margin: [0, 0, 0, 30],
          }
        : {},

      // Export date
      {
        text: `Exported: ${data.exportDate}`,
        fontSize: 9,
        color: "#666666",
        alignment: "center",
      },
    ],
    pageBreak: "after",
  };
}
