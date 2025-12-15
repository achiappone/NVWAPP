// app/components/LabeledValue.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  label: string;
  value: string;
}

export default function LabeledValue({ label, value }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  label: {
    color: "orange",
    fontSize: 18,
    marginRight: 4,
  },
  value: {
    color: "white",
    fontSize: 18,
  },
});
