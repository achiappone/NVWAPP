import { PowerGridCell } from "@/pdf/utils/powerGridMap";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function PowerGridPreview({
  grid,
}: {
  grid: PowerGridCell[][];
}) {
  
  const columnCount = grid[0].length;
  
  return (
    <ScrollView horizontal>
        <View style={styles.grid}>
        {/* Column Headers */}
        <View style={styles.headerRow}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <View key={colIndex} style={styles.headerCell}>
              <Text style={styles.headerText}>
                Col {colIndex + 1}
              </Text>
            </View>
          ))}
        </View>
        {/* Grid Rows */}
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  { backgroundColor: "#222" },
                ]}
              >
                <Text style={styles.lineId}>
                  {cell.powerLineId}
                </Text>
                <Text style={styles.order}>
                  #{cell.order}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 0,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 60,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#a2f938",
  },
  lineId: {
    fontSize: 10,
    fontWeight: "600",
    color: "#a2f938",
  },
  order: {
    fontSize: 11,
    opacity: 0.8,
    color: "#a2f938",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#333",
    height: 30,
  },
  headerCell: {
    width: 60,
    //height: 50,
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
});
