// pdf/buildPdf.ts
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { chauvetLogoBase64 } from "./assets/chauvetLogo";
import { buildBomSection } from "./sections/bomSection";
import { buildControlSection } from "./sections/controlSection";
import { buildCoverSection } from "./sections/coverSection";
import { buildScreenGrid } from "./sections/drawings/buildScreenGrid";
import { buildPowerGrid } from "./sections/drawings/powerGrid";
import { buildSignalGrid } from "./sections/drawings/signalGrid";
import { buildSystemGrid } from "./sections/drawings/systemGrid";
import { buildScreenSection } from "./sections/screenSection";
import { buildCablesSection } from "./sections/signalCableSection";
import { styles } from "./styles";
import { ExportDocument } from "./types";
import { buildPowerLines } from "./utils/powerModel";

let pdfInitialized = false;

export function exportConfigPdf(exportData: ExportDocument) {

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

  const screen = exportData.project.screens[0];
  const { hardware, control, cables } = screen;

  //power grid data
  const ROWS_PER_POWER_LINE = 2;
  const panelsPerLine: number[] = [];
  for (let row = 0; row < hardware.panelsHigh; row += ROWS_PER_POWER_LINE) {
    const rowsInThisLine = Math.min(
      ROWS_PER_POWER_LINE,
      hardware.panelsHigh - row
    );

    panelsPerLine.push(rowsInThisLine * hardware.panelsWide);
  }

  const powerLines = buildPowerLines({
    panelsPerLine,
    panelMaxWatts: hardware.maxWattsPerPanel, // 
    inputVoltage: cables.inputVoltage,        // 
  });

    //console.log(powerLines);


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
      buildCoverSection({
        projectName: exportData.meta.projectName,
        screens: exportData.project.screens.map(s => ({
          label: s.label,
        })),
        exportDate: exportData.meta.exportedAt,
        logoBase64: chauvetLogoBase64,
        notes: exportData.meta.notes,
      }),
      { text: "", pageBreak: "before" },
      ...buildScreenSection({
        pixelPitch: hardware.pixelPitch,
        widthMeters: hardware.widthMeters,
        heightMeters: hardware.heightMeters,
        aspectRatio: hardware.aspectRatio,
      }),
      { text: "", pageBreak: "before" },

      ...buildControlSection(control),
      { text: "", pageBreak: "before" },

      ...buildCablesSection(cables),
      { text: "", pageBreak: "before" },

      ...buildScreenGrid({
        screen: {
          hardware: {
            width: hardware.widthMeters,
            height: hardware.heightMeters,
          },
        },
        application: exportData.project.application,
      }),
      { text: "", pageBreak: "before" },

      ...buildPowerGrid(powerLines),
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
