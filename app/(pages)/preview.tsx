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
import { useStore } from "../../store/StoreProvider";
import { buildConfigExport } from "../../utils/buildConfigExport";

import { buildInstallationGridFromHardware } from "../../pdf/utils/gridBuilder";
import { buildScreenGridGeometry } from "../../pdf/utils/gridMath";

const Preview = observer(() => {
  const store = useStore();
  const project = store.activeProject;

  if (!project) {
    return null;
  }

  // Build normalized export data
  const exportData = buildConfigExport(project);

  

  // Get first screen (single-screen for now)
  const screen = exportData.project.screens[0];

  if (!screen) {
    return null;
  }

  const { hardware } = screen;


  const application = project.hardware.application;
  // Build physical grid definition from product rules
  const gridDef = buildInstallationGridFromHardware({
    width: hardware.width,
    height: hardware.height,
    application,
  });

  // Compute grid geometry
  const geometry = buildScreenGridGeometry(gridDef);

  // Scale mm → screen pixels for preview
  const SCALE = 0.08;

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
        {geometry.cabinets.map((cab) => (
          
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

      <View style={styles.jsonContainer}>
        <Text style={styles.jsonText}>
          {JSON.stringify(exportData, null, 2)}
        </Text>
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
});
