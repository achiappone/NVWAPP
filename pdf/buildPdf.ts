import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { chauvetLogoBase64 } from "./assets/chauvetLogo";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { PROCESSORS } from "../constants/processors";
import {
  assignCabinetsToPortsVertical,
  calculateSignalGrid,
} from "../domain/signalGrid";
import { calculateA10sProControlLoad } from "../utils/control/a10sProCapacity";

import { buildBomSection } from "./sections/bomSection";
import { buildControlSection } from "./sections/controlSection";
import { buildCoverSection } from "./sections/coverSection";
import { buildScreenGrid } from "./sections/drawings/buildScreenGrid";
import { buildPowerGrid } from "./sections/drawings/powerGrid";
import { buildSignalGridSection } from "./sections/drawings/signalGrid";
import { buildSystemGrid } from "./sections/drawings/systemGrid";
import { buildScreenSection } from "./sections/screenSection";
import { buildCablesSection } from "./sections/signalCableSection";

import { calculateSystemGrid } from "../domain/systemGrid";
import { pdfStyles } from "./styles/pdfStyles";
import { ApplicationType, ExportDocument } from "./types";
import { buildInstallationGridFromHardware } from "./utils/gridBuilder";
import { buildPowerLines } from "./utils/powerModel";

let pdfInitialized = false;

/**
 * SAME processor normalization used in Preview
 */
function normalizeProcessorModel(
  label: string
): keyof typeof PROCESSORS | null {
  if (label.includes("MX20")) return "MX20";
  if (label.includes("MX30")) return "MX30";
  if (label.includes("MX40")) return "MX40 Pro";
  return null;
}

export function exportConfigPdf(
  exportData: ExportDocument
): Promise<void> {
  // ─────────────────────────────────────────────
  // PDFMAKE INIT (SSR SAFE)
  // ─────────────────────────────────────────────
  if (!pdfInitialized) {
    const vfs =
      (pdfFonts as any).pdfMake?.vfs ||
      (pdfFonts as any).vfs ||
      (pdfFonts as any);

    if (!vfs) {
      return Promise.reject(
        new Error("pdfMake fonts not available")
      );
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

  // Some sections expect hardware on control
  //(control as any).__hardware = hardware;

  // ─────────────────────────────────────────────
  // GRID DEFINITION
  // ─────────────────────────────────────────────
  const gridDef = buildInstallationGridFromHardware({
    width: hardware.widthMeters,
    height: hardware.heightMeters,
    application,
  });

  const rows = gridDef.rowHeightsMm.length;
  const cols = gridDef.columnWidthsMm.length;

  const cabinets: { row: number; col: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cabinets.push({ row, col });
    }
  }

  // ─────────────────────────────────────────────
  // POWER GRID
  // ─────────────────────────────────────────────
  const powerSection: any[] = [];
  const totalPanels =
    hardware.panelsWide * hardware.panelsHigh;

  if (totalPanels > 0) {
    const powerLines = buildPowerLines({
      totalPanels,
      panelMaxWatts: hardware.maxWattsPerPanel,
      inputVoltage: cables.inputVoltage,
      maxCircuitCurrent: 16,
      safetyFactor: 0.8,
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
  // SIGNAL GRID
  // ─────────────────────────────────────────────
  const processorKey = normalizeProcessorModel(
    control.processorModel
  );
  const processorSpec = processorKey
    ? PROCESSORS[processorKey]
    : null;

  const totalScreenPixels =
    hardware.widthMeters &&
    hardware.heightMeters &&
    hardware.pixelPitch
      ? Math.round(
          ((hardware.widthMeters * 1000) /
            hardware.pixelPitch) *
            ((hardware.heightMeters * 1000) /
              hardware.pixelPitch)
        )
      : 0;

  const controlSizing =
    processorSpec && totalScreenPixels > 0
      ? calculateA10sProControlLoad({
          totalScreenPixels,
          cabinetPixels: 1,
          frameRateHz: control.refreshRate as
            | 24
            | 25
            | 30
            | 50
            | 60
            | 120
            | 144
            | 240,
          bitDepth: control.bitDepth as 8 | 10 | 12,
          portsPerProcessor: processorSpec.ports,
        })
      : null;

  const portsRequired =
    controlSizing?.portsRequired ?? 0;

  const signalGridData =
    portsRequired > 0
      ? calculateSignalGrid({
          totalCabinets: cabinets.length,
          portsRequired,
        })
      : null;

  const cabinetPortAssignments = signalGridData
    ? assignCabinetsToPortsVertical({
        cabinets,
        cabinetsPerPort:
          signalGridData.cabinetsPerPort,
        direction: "top-down",
      })
    : [];


      const systemGrid =
        cabinetPortAssignments.length > 0
          ? calculateSystemGrid(
              cabinets,
              cabinetPortAssignments,
              {
                id: "processor-1",
                label: control.processorModel,
                model: control.processorModel,
              }
            )
          : null;


  // ─────────────────────────────────────────────
  // DOCUMENT DEFINITION
  // ─────────────────────────────────────────────
  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [30, 60, 30, 60],
    styles: pdfStyles,

    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      margin: [0, 10, 0, 0],
    }),

    content: [
      buildCoverSection({
        projectName: exportData.meta.projectName,
        screens: exportData.project.screens.map(
          (s) => ({ label: s.label })
        ),
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

      ...buildControlSection({
        ...control,
      hardware,
  }),

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

      ...(signalGridData
        ? [
            ...buildSignalGridSection({
              rows,
              cols,
              cabinets,
              cabinetsPerPort:
                signalGridData.cabinetsPerPort,
              cabinetPortAssignments,
            }),
            { text: "", pageBreak: "before" },
          ]
        : []),

      ...systemGrid
        ? [
            ...buildSystemGrid(systemGrid),
          ]
        : [],

      { text: "", pageBreak: "before" },

      ...buildBomSection(exportData),
    ],
  };

  // ─────────────────────────────────────────────
  // PDF EXPORT (WEB vs MOBILE) — PROMISE-BASED
  // ─────────────────────────────────────────────
  return new Promise<void>((resolve, reject) => {
    try {
      if (Platform.OS === "web") {
        pdfMake
          .createPdf(docDefinition)
          .getBlob((blob: Blob) => {
            try {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");

              a.href = url;
              a.download = "video-wall-config.pdf";
              a.click();

              URL.revokeObjectURL(url);
              resolve();
            } catch (err) {
              reject(err);
            }
          });

        return;
      }

      // iOS + Android
      pdfMake.createPdf(docDefinition).getBase64(
        async (base64: string) => {
          try {
            const fileUri =
              FileSystem.documentDirectory +
              "video-wall-config.pdf";

            await FileSystem.writeAsStringAsync(
              fileUri,
              base64,
              { encoding: FileSystem.EncodingType.Base64 }
            );

            await Sharing.shareAsync(fileUri);
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
