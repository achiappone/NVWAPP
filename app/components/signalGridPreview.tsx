import { GRID_COLORS } from "@/domain/gridColors";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function SignalGridPreview({
  cabinets,
  cabinetPortMap,
  scale,
}: {
  cabinets: {
    row: number;
    col: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  cabinetPortMap: number[];
  scale: number;
}) {
  if (cabinets.length === 0) return null;

  const maxCol =
    Math.max(...cabinets.map(c => c.col)) + 1;

  const totalWidth =
    Math.max(...cabinets.map(c => c.x + c.width)) * scale;
  const totalHeight =
    Math.max(...cabinets.map(c => c.y + c.height)) * scale;

  // Compute scaled width for each column independently
    const columnWidths = Array.from({ length: maxCol }).map(
      (_, colIndex) => {
        const colCabinets = cabinets.filter(
          c => c.col === colIndex
        );

        const maxWidthMm = Math.max(
          ...colCabinets.map(c => c.width)
        );

        return maxWidthMm * scale;
      }
    );


  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        <Text style={styles.sectionTitle}>Signal Distribution</Text>
        {/* Column Headers */}
        <View style={styles.headerRow}>
          {columnWidths.map((width, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.headerCell,
                { width },
              ]}
            >
              <Text style={styles.headerText}>
                Col {colIndex + 1}
              </Text>
            </View>
          ))}

        </View>

        {/* Grid */}
        <View
          style={[
            styles.grid,
            { width: totalWidth, height: totalHeight },
          ]}
        >
          {cabinets.map((cab, index) => {
            const portIndex = cabinetPortMap[index] ?? 0;
            const color =
              GRID_COLORS[portIndex % GRID_COLORS.length];

            return (
              <View
                key={`${cab.row}-${cab.col}`}
                style={{
                  position: "absolute",
                  left: cab.x * scale,
                  top: cab.y * scale,
                  width: cab.width * scale,
                  height: cab.height * scale,
                  borderWidth: 1,
                  borderColor: color,
                  backgroundColor: `${color}33`,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>
                  P{portIndex + 1}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    position: "relative",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#333",
    height: 30,
  },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#a2f938",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#a2f938",
  },
  systemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  sectionTitle: {
    color: "#FF8C00",
    fontSize: 18,
    marginBottom: 6,
  },
});

export default SignalGridPreview;
