// pdf/sections/controlSection.ts

import { PROCESSORS } from "@/constants/processors";
import { calculateA10sProControlLoad } from "@/utils/control/a10sProCapacity";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function normalizeProcessorModel(
  label: string
): keyof typeof PROCESSORS | null {
  if (!label) return null;
  if (label.includes("MX20")) return "MX20";
  if (label.includes("MX30")) return "MX30";
  if (label.includes("MX40")) return "MX40 Pro";
  return null;
}

// ------------------------------------------------------------
// Section builder
// ------------------------------------------------------------

export function buildControlSection(control: any) {
  const content: any[] = [];

  // ----------------------------------------------------------
  // Header
  // ----------------------------------------------------------

  content.push({
    text: "Control",
    style: "sectionHeader",
  });

  // ----------------------------------------------------------
  // Raw control details
  // ----------------------------------------------------------

  content.push({
    text: "Control Settings",
    style: "subSectionHeader",
    margin: [0, 6, 0, 4],
  });

  content.push({
    table: {
      widths: ["40%", "60%"],
      body: [
        ["Processor", control.processorModel || "—"],
        ["Source Resolution", control.sourceResolution || "—"],
        [
          "Refresh Rate",
          control.refreshRate ? `${control.refreshRate} Hz` : "—",
        ],
        ["Bit Depth", control.bitDepth ? `${control.bitDepth}-bit` : "—"],
        ["HDR", control.hdr ? "Yes" : "No"],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 6, 0, 10],
  });

  // ----------------------------------------------------------
  // Derived control load / infrastructure
  // ----------------------------------------------------------

  const hardware = (control as any).__hardware;

  if (hardware) {
    const totalScreenPixels =
      hardware.widthMeters &&
      hardware.heightMeters &&
      hardware.pixelPitch
        ? Math.round(
            ((hardware.widthMeters * 1000) / hardware.pixelPitch) *
              ((hardware.heightMeters * 1000) / hardware.pixelPitch)
          )
        : 0;

    const processorKey = normalizeProcessorModel(control.processorModel);
    const processorSpec = processorKey ? PROCESSORS[processorKey] : null;

    if (processorSpec && totalScreenPixels > 0) {
      const sizing = calculateA10sProControlLoad({
        totalScreenPixels,
        cabinetPixels: 1, // placeholder until cabinet modeling exists
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
      });

      const spareCapacityPercent =
        100 - sizing.overallUtilizationPercent;

      content.push({
        text: "Control Load",
        style: "subSectionHeader",
        margin: [0, 6, 0, 4],
      });

      content.push({
        table: {
          widths: ["40%", "60%"],
          body: [
            ["Total Screen Pixels", totalScreenPixels.toLocaleString()],
            [
              "Pixels per Port (Max)",
              sizing.pixelsPerPort.toLocaleString(),
            ],
            ["Ports Required", String(sizing.portsRequired)],
            [
              "Ports per Processor",
              String(processorSpec.ports),
            ],
            ["Processors Required", String(sizing.processorsRequired)],
            [
              "Control Utilization",
              `${sizing.overallUtilizationPercent.toFixed(1)}%`,
            ],
            [
              "Spare Capacity",
              `${spareCapacityPercent.toFixed(1)}%`,
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 10],
      });
    }
  }

  return content;
}
