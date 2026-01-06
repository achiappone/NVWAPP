// app/preview.tsx
import { PROCESSORS } from "@/constants/processors";
import { GRID_COLORS } from "@/domain/gridColors";
import { assignCabinetsToPorts, assignCabinetsToPortsVertical, calculateSignalGrid } from "@/domain/signalGrid";
import { calculateMediaServerOutputs } from "@/domain/videoSourceCalculations";
import { calculateA10sProControlLoad } from "@/utils/control/a10sProCapacity";
import { observer } from "mobx-react-lite";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { exportConfigPdf } from "../../pdf/buildPdf";
import { buildInstallationGridFromHardware } from "../../pdf/utils/gridBuilder";
import { buildScreenGridGeometry } from "../../pdf/utils/gridMath";
import { useStore } from "../../store/StoreProvider";
import { buildConfigExport } from "../../utils/buildConfigExport";

const Preview = observer(() => {
  const store = useStore();
  const project = store.activeProject;

  if (!project) {
    return null;
  }

  const exportData = buildConfigExport(project);
  console.log(exportData.project.screens[0].cables);

  const [isExporting, setIsExporting] = React.useState(false);

  // Build normalized export data
  const hardware = project.hardware;
    if (!hardware) {
      return null;
    }
      
  const application = hardware.application;
  // Build physical grid definition from product rules
  //console.log("Application:", application);
  
    //export helper function for button
    const handleExport = async () => {
      try {
        setIsExporting(true);

        // Give React one frame to render the overlay
        await new Promise(resolve => setTimeout(resolve, 50));

        await exportConfigPdf(exportData);
      } catch (err) {
        console.error("Export failed", err);
      } finally {
        setIsExporting(false);
      }
    };


//helper function for port calculation
// TODO(domain): preview + PDF duplicate calculations
// Extract shared calculation helpers when refactoring
function normalizeProcessorModel(
  label: string
): keyof typeof PROCESSORS | null {
  if (label.includes("MX20")) return "MX20";
  if (label.includes("MX30")) return "MX30";
  if (label.includes("MX40")) return "MX40 Pro";
  return null;
}

const SIGNAL_VIEW_MODE: "linear" | "vertical" = "vertical";

//Compute port utulization
// TODO(domain): preview + PDF duplicate calculations
// Extract shared calculation helpers when refactoring
const { control } = project;

const totalScreenPixels = 
  hardware.width && hardware.height && hardware.pixelPitch
    ? Math.round(
      ((hardware.width * 1000) / hardware.pixelPitch) *
      ((hardware.height * 1000) / hardware.pixelPitch)
    )
    : 0;

const processorKey = normalizeProcessorModel(control.processorModel);
const processorSpec = processorKey ? PROCESSORS[processorKey] : null;

const controlSizing =
  processorSpec && totalScreenPixels > 0
    ? calculateA10sProControlLoad({
        totalScreenPixels,
        cabinetPixels: 1, // placeholder until cabinets are modeled
        frameRateHz: control.refreshRate as
          | 24 | 25 | 30 | 50 | 60 | 120 | 144 | 240,
        bitDepth: control.bitDepth as 8 | 10 | 12,
        portsPerProcessor: processorSpec.ports,
      })
    : null;

const gridDef = buildInstallationGridFromHardware({
    width: hardware.width,
    height: hardware.height,
    application,
  });

console.log(
  "%cTest Log: \n%c" +
    "Resolved model: " + exportData.meta.modelName + "\n" +
    "Application: " + application + "\n" +
    "Mains Volts: " + exportData.project.screens[0].cables.inputVoltage + " V\n" +
    "Bit Depth: " + project.control.bitDepth + " bit" + "\n" +
    "Max Watts/Panel: " + exportData.project.screens[0].hardware.maxWattsPerPanel + " W\n" +
    "Pixel Pitch: " + hardware.pixelPitch + " mm\n" +
    "Panels Wide: " + exportData.project.screens[0].hardware.panelsWide + " pc(s)" + "\n" +
    "Panels High: " + exportData.project.screens[0].hardware.panelsHigh + " pc(s)" + "\n" +
    "Total Cabinets: " +
      (exportData.project.screens[0].hardware.panelsWide *
       exportData.project.screens[0].hardware.panelsHigh) + " pc(s)",

  // styles applied to %c
  "font-weight: bold; font-size: 14px;",
  "font-weight: normal;"
);



  // Compute grid geometry
  const geometry = buildScreenGridGeometry(gridDef);
  //console.log("Cabinet count:", geometry.cabinets.length);

  

  // Scale mm → screen pixels for preview
  const SCALE = 0.08;

  //computer signal grid preview dimensions
  const signalGridWidthPx =
  geometry.totalWidthMm * SCALE;

const signalGridHeightPx =
  geometry.totalHeightMm * SCALE;

  // Limit preview rendering for performance
const MAX_PREVIEW_CABINETS = 300;

const previewCabinets =
  geometry.cabinets.length > MAX_PREVIEW_CABINETS
    ? geometry.cabinets.slice(0, MAX_PREVIEW_CABINETS)
    : geometry.cabinets;

    const LABELS: Record<string, string> = {
      pixelPitch: "Pixel Pitch (mm):",
      width: "Width (m):",
      height: "Height (m):",
      application: "Application:",
      processorModel: "Processor:",
      sourceResolution: "Source Resolution:",
      refreshRate: "Refresh Rate (Hz):",
      bitDepth: "Bit Depth (bit):",
      hdr: "HDR:",
      fiberRequired: "Fiber Required:",
      powerLinking: "Power Linking:",
      powerLength: "Power Length (m):",
      signalLength: "Signal Length (m):",
      signalType: "Home-run Signal Type (Ethernet/Fiber):",
      powerType: "Power Type:",
      signalLinking: "Home-run Signal Linking:",
      voltageInput: "Mains Voltage (V):",
    };

    //calculate media server sources required
    const totalWidthPx =
      hardware.width && hardware.pixelPitch
        ? Math.round((hardware.width * 1000) / hardware.pixelPitch)
        : 0;

    const totalHeightPx =
      hardware.height && hardware.pixelPitch
        ? Math.round((hardware.height * 1000) / hardware.pixelPitch)
        : 0;

    //calculate media server outputs required
    const mediaServerOutputs = calculateMediaServerOutputs({
      totalWidthPx,
      totalHeightPx,
      outputFormat: project.control.sourceResolution as
        | "HD (1920x1080)"
        | "4K (3840x2160)",
    });
    //compute signal grid assignment (table value-based style)
    const totalCabinets = geometry.cabinets.length;
    const signalGrid =
      processorSpec && controlSizing
        ? calculateSignalGrid({
            totalCabinets,
            portsRequired: controlSizing.portsRequired,
          })
        : null;

        const signalCapacityError =
          controlSizing && processorSpec
            ? controlSizing.portsRequired > processorSpec.ports
            : false;

    //computer signal grid assignment (visual grid with routing)
    const cabinetPortMapLinear =
      controlSizing
        ? assignCabinetsToPorts({
            totalCabinets,
            portsRequired: controlSizing.portsRequired,
          })
        : [];

    const cabinetPortMapVertical =
      controlSizing
        ? assignCabinetsToPortsVertical({
            cabinets: geometry.cabinets,
            cabinetsPerPort: signalGrid?.cabinetsPerPort ?? [],
            direction: "top-down",
          })
        : [];

        const cabinetPortMap =
          SIGNAL_VIEW_MODE === "vertical"
            ? cabinetPortMapVertical
            : cabinetPortMapLinear;

          
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "stretch" }}
      scrollEnabled={!isExporting}
    >
      <Text style={styles.title}>Preview</Text>

            <View style={styles.exportContainer}>
        <TouchableOpacity
          style={[
            styles.exportButton,
            isExporting && { opacity: 0.6 },
          ]}
          onPress={handleExport}
          disabled={isExporting}
        >
          <Text style={styles.exportText}>
            {isExporting ? "Exporting..." : "Export PDF"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isExporting} transparent animationType="fade">
        <View style={styles.blocker}>
          <View style={styles.blockerCard}>
            <ActivityIndicator size="large" />
            <Text style={styles.blockerText}>Preparing export...</Text>
          </View>
        </View>
      </Modal>


      <Text style={styles.sectionTitle}>Grid Preview (Scaled)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View
          style={[
            styles.gridContainer,
            {
              width: geometry.totalWidthMm * SCALE,
              height: geometry.totalHeightMm * SCALE,
            },
          ]}
        >
          {previewCabinets.map((cab) => (
        <View
          key={`${cab.row}-${cab.col}`}
          style={{
            position: "absolute",
            left: cab.x * SCALE,
            top: cab.y * SCALE,
            width: cab.width * SCALE,
            height: cab.height * SCALE,
            borderWidth: 1,
            borderColor: "#00ffcc",
            backgroundColor: "rgba(0, 255, 204, 0.15)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        <Text style={styles.cabinetLabel}>
          {cab.col + 1},{cab.row + 1}
        </Text>
        </View>
        ))}

        </View>
      </ScrollView>

      {/*Signal Grid Preview*/}
        
      {signalGrid && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signal Distribution</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Ports Used:</Text>
            <Text style={styles.value}>{signalGrid.portsUsed}</Text>
          </View>

          {signalGrid.cabinetsPerPort.map((count, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>Port {index + 1}:</Text>
              <Text style={styles.value}>{count} cabinets</Text>
            </View>
          ))}
        

          <Text style={styles.sectionTitle2}>Signal Grid</Text>
          {signalCapacityError && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: "red" }]}>
                Signal Capacity:
              </Text>
              <Text style={[styles.value, { color: "red" }]}>
                Ports required exceed available ports
              </Text>
            </View>
          )}
          
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator
              contentContainerStyle={{
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  width: signalGridWidthPx,
                  height: signalGridHeightPx,
                  position: "relative",
                  marginBottom: 24,
                  marginTop: 15,
                }}
              >
          {previewCabinets.map((cab, index) => {
            const portIndex = cabinetPortMap[index] ?? 0;
            const color =
              GRID_COLORS[portIndex % GRID_COLORS.length];

            return (
              <View
                key={`${cab.row}-${cab.col}`}
                style={{
                  position: "absolute",
                  left: cab.x * SCALE,
                  top: cab.y * SCALE,
                  width: cab.width * SCALE,
                  height: cab.height * SCALE,
                  borderWidth: 1,
                  borderColor: color,
                  backgroundColor: `${color}33`,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.cabinetLabel}>
                  P{portIndex + 1}
                </Text>
              </View>
            );
          })}
            </View>
            </ScrollView>
        </View>
      )}

        {/* Show preview using JSON */}
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Project Info</Text>

      {Object.entries(exportData.meta).map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{LABELS[label] ?? label}</Text>
          <Text style={styles.value}>{String(value)}</Text>
        </View>
      ))}
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hardware</Text>

      {Object.entries(hardware).map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{LABELS[label] ?? label}</Text>
          <Text style={styles.value}>{String(value)}</Text>
        </View>
      ))}
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Control</Text>

      {Object.entries(project.control).map(
        ([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{LABELS[label] ?? label}</Text>
          <Text style={styles.value}>{String(value)}</Text>
        </View>
      ))}

      <View style={styles.row}>
        <Text style={styles.label}>Media Server Outputs:</Text>
        <Text style={styles.value}>
          {mediaServerOutputs.outputs}
        </Text>
      </View>

            
    </View>

    {controlSizing && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control Load</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Ports Required:</Text>
          <Text style={styles.value}>
            {controlSizing.portsRequired}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Processors Required:</Text>
          <Text style={styles.value}>
            {controlSizing.processorsRequired}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Utilization:</Text>
          <Text style={styles.value}>
            {controlSizing.overallUtilizationPercent.toFixed(1)}%
          </Text>
        </View>
      </View>
    )}


    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cables</Text>

      {Object.entries(project.cables).map(
        ([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{LABELS[label] ?? label}</Text>
          <Text style={[
            styles.value, label === "signalType" && styles.centerValue,
          ]} >{String(value)}
          </Text>
        </View>
      ))}
    </View>

    </ScrollView>
  );
});

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 20,
  },
  subTitle: {
    color: "#fff",
    fontSize: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  gridContainer: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#555",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  cabinetLabel: {
    color: "#fff",
    fontSize: 12,
  },
  jsonContainer: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
  },
  jsonText: {
    color: "#0f0",
    fontFamily: "Courier",
    fontSize: 16,
  },
  exportContainer: {
    marginTop: 20,
  },
  exportButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  exportText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    color: "#FF8C00",
    fontSize: 18,
    marginBottom: 6,
  },
  sectionTitle2: {
    color: "#FF8C00",
    fontSize: 18,
    marginBottom: 0,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    width: 160,
    color: "#aaa",
    fontWeight: "600",
  },
  value: {
    flex: 1,
    color: "#fff",
  },
  centerValue: {
    textAlign: "left",
    fontWeight: "600",
  },
  exportOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  exportModal: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    minWidth: 220,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF8C00",
  },
  exportLabel: {
    marginTop: 12,
    color: "#fff",
    fontSize: 14,
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  blocker: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  blockerCard: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF8C00",
  },
  blockerText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
