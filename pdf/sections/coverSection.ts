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
  
    const formattedDate = new Date(data.exportDate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    });

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
        text: "Video Wall Configuration Report",
        fontSize: 14,
        italics: true,
        alignment: "center",
        margin: [0, 0, 0, 24],
      },

      // Screen list summary
      {
        stack: data.screens.map((s) => ({
          text: s.label,
          fontSize: 16,
          bold: true,
          alignment: "center",
          margin: [0, 4, 0, 0],
        })),
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
        text: `Exported: ${formattedDate}`,
        fontSize: 9,
        color: "#666666",
        alignment: "center",
      },
    ],
    //pageBreak: "after",
  };
}
