// app/preview.tsx
import { observer } from "mobx-react-lite";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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


  // Build normalized export data
  const hardware = project.hardware;
    if (!hardware) {
      return null;
    }
      
  const application = hardware.application;
  // Build physical grid definition from product rules
  //console.log("Application:", application);
  
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
      signalType: "Signal Type:",
      powerType: "Power Type:",
      signalLinking: "Signal Linking:",
      homeRun: "Home Run:",
      voltageInput: "Mains Voltage (V):",
    };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preview</Text>

      <Text style={styles.subTitle}>Grid Preview (Scaled)</Text>
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
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cables</Text>

      {Object.entries(project.cables).map(
        ([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{LABELS[label] ?? label}</Text>
          <Text style={styles.value}>{String(value)}</Text>
        </View>
      ))}
    </View>



      <View style={styles.exportContainer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => {
            console.log("Export pressed");
            exportConfigPdf(exportData);
          }}
        >
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>
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
    alignItems: "center",
  },
  exportButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exportText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#FF8C00",
    fontSize: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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

});
