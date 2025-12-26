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
import { ApplicationType, ExportDocument } from "./types";
import { buildInstallationGridFromHardware } from "./utils/gridBuilder";
import { buildPowerLines } from "./utils/powerModel";

let pdfInitialized = false;

export function exportConfigPdf(exportData: ExportDocument) {
  // ─────────────────────────────────────────────
  // PDF MAKE INIT (SSR SAFE)
  // ─────────────────────────────────────────────
  if (!pdfInitialized) {
    const vfs =
      (pdfFonts as any).pdfMake?.vfs ||
      (pdfFonts as any).vfs ||
      (pdfFonts as any);

    if (!vfs) {
      console.error("pdfMake fonts not available", pdfFonts);
      return;
    }

    pdfMake.vfs = vfs;

    pdfMake.fonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
      },
    };

    pdfInitialized = true;
  }

  // ─────────────────────────────────────────────
  // DATA EXTRACTION
  // ─────────────────────────────────────────────
  const screen = exportData.project.screens[0];
  const { hardware, control, cables } = screen;

  const application = exportData.project.application
    .trim()
    .toLowerCase() as ApplicationType;

  // ─────────────────────────────────────────────
  // OPTIONAL POWER GRID SECTION
  // ─────────────────────────────────────────────
  const powerSection: any[] = [];

  const totalPanels =
    hardware.panelsWide * hardware.panelsHigh;

  if (totalPanels <= 0) {
    console.warn("No panels detected — skipping power grid");
  } else {
    const powerLines = buildPowerLines({
      totalPanels,
      panelMaxWatts: hardware.maxWattsPerPanel,
      inputVoltage: cables.inputVoltage,
      maxCircuitCurrent: 16,
      safetyFactor: 0.8,
    });

    const gridDef = buildInstallationGridFromHardware({
      width: hardware.widthMeters,
      height: hardware.heightMeters,
      application,
    });

    powerSection.push(
      ...buildPowerGrid({
        gridDef,
        powerLines,
        application,
      }),
      { text: "", pageBreak: "before" }
    );
  }

  // ─────────────────────────────────────────────
  // DOCUMENT DEFINITION
  // ─────────────────────────────────────────────
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
        application,
      }),

      { text: "", pageBreak: "before" },

      ...powerSection,

      ...buildSignalGrid({ hardware, control, cables }),

      { text: "", pageBreak: "before" },

      ...buildSystemGrid({ hardware, control, cables }),

      { text: "", pageBreak: "before" },

      ...buildBomSection(exportData),
    ],
  };

  pdfMake.createPdf(docDefinition).download("video-wall-config.pdf");
}
