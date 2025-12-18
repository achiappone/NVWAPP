// pdf/buildPdf.ts
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

import { buildBomSection } from "./sections/bomSection";
import { buildCablesSection } from "./sections/cablesSection";
import { buildControlSection } from "./sections/controlSection";
import { buildScreenGrid } from "./sections/drawings/buildScreenGrid";
import { buildPowerGrid } from "./sections/drawings/powerGrid";
import { buildSignalGrid } from "./sections/drawings/signalGrid";
import { buildSystemGrid } from "./sections/drawings/systemGrid";
import { buildScreenSection } from "./sections/screenSection";
import { styles } from "./styles";

let pdfInitialized = false;

export function exportConfigPdf(exportData: {
  meta: {
    app: string;
    version: string;
    exportedAt: string;
    projectId: string;
    projectName: string;
  };
  project: {
    application: string;
    hardware: {
      pixelPitch: number;
      width: number;
      height: number;
      aspectRatio: string;
      panelsWide: number;
      panelsHigh: number;
    };
    control: {
      processorModel: string;
      sourceResolution: string;
      refreshRate: number;
      bitDepth: number;
      hdr: boolean;
    };
    cables: {
      fiberRequired: boolean;
      powerLinking: string;
      signalLinking: string;
    };
  };
}) {

  // ✅ SAFE lazy initialization (SSR-safe)
// inside exportConfigPdf()
if (!pdfInitialized) {
  const vfs =
    (pdfFonts as any).pdfMake?.vfs ||
    (pdfFonts as any).vfs ||
    (pdfFonts as any);

  if (vfs) {
    pdfMake.vfs = vfs;

    //define fonts to make bold italics respond in pdfmake
    pdfMake.fonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
      },
    };

    pdfInitialized = true;
  } else {
    console.error("pdfMake fonts not available", pdfFonts);
    return;
  }
}
  //temp log to check what is in pdfmake vfs
  console.log(Object.keys(pdfMake.vfs));

  const { hardware, control, cables } = exportData.project;

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [30, 60, 30, 60],
    styles,
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      margin: [0, 10, 0, 0],
    }),
    content: [
      ...buildScreenSection({
        pixelPitch: hardware.pixelPitch,
        widthMeters: hardware.width,
        heightMeters: hardware.height,
        aspectRatio: hardware.aspectRatio,
      }),
      { text: "", pageBreak: "before" },

      ...buildControlSection(control),
      { text: "", pageBreak: "before" },

      ...buildCablesSection(cables),
      { text: "", pageBreak: "before" },

      ...buildScreenGrid({
        project: exportData.project,
        application: exportData.project.application,
      }),
      { text: "", pageBreak: "before" },

      ...buildPowerGrid({ hardware, control, cables }),
      { text: "", pageBreak: "before" },

      ...buildSignalGrid({ hardware, control, cables }),
      { text: "", pageBreak: "before" },

      ...buildSystemGrid({ hardware, control, cables }),
      { text: "", pageBreak: "before" },

      ...buildBomSection(exportData),
    ],
  };

  pdfMake.createPdf(docDefinition).download("video-wall-config.pdf");
}
