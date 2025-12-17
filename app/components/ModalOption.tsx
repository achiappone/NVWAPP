import { modalTheme } from "@/theme/modalTheme";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ModalOptionProps {
  label: string;
  onPress: () => void;
}

const ModalOption: React.FC<ModalOptionProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ModalOption;

const styles = StyleSheet.create({
  row: {
    height: 52,                 // hard-coded row height
    justifyContent: "center",
    alignSelf: "stretch",
    paddingHorizontal: 20,      // hard-coded padding
    backgroundColor: modalTheme.rowBackground,
    borderBottomWidth: 1,
    borderBottomColor: modalTheme.divider,
  },
  label: {
    color: modalTheme.rowText,
    fontSize: 16,
  },
});
