import { ArrowIcon } from "@/assets/icons/svgIcons";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStore } from "../../store/StoreProvider";
import { ModalAnimationType } from "../../Types";
import FullScreenModal from "../components/FullScreenModal";

export default observer(function Hardware() {
  const [isWidthModalVisible, setWidthModalVisible] = useState(false);
  const [isHeightModalVisible, setHeightModalVisible] = useState(false);

  // width list like pg2Hardware
  const widthOptions = [
    "0.0",
    ...Array.from({ length: 60 }, (_, i) => (0.5 * (i + 1)).toFixed(1)),
  ];

  /** Convert meters → feet/inches */
  const formatMetersToFeetInches = (meters: number) => {
    const totalInches = meters * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${meters} m (${feet}'${inches}")`;
  };

  // access hardware store values
  const { hardware } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware Configuration</Text>

      {/* Width Selection Button */}
      <TouchableOpacity onPress={() => setWidthModalVisible(true)}>
        <View style={styles.button}>
          <Text style={{ fontSize: 18 }}>
            <Text style={{ color: "orange" }}>Select Width: </Text>
            <Text style={{ color: "white" }}>
              {formatMetersToFeetInches(hardware.width)}
            </Text>
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      {/* Width Selection Modal */}
      <FullScreenModal
        visible={isWidthModalVisible}
        onRequestClose={() => setWidthModalVisible(false)}
        title="Select Width (meters):"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {widthOptions.map((val) => {
            const numericVal = Number(val);
            const totalInches = numericVal * 39.3701;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);

            return (
              <TouchableOpacity
                key={val}
                onPress={() => {
                  hardware.setWidth(numericVal); // <-- FIXED
                  setWidthModalVisible(false);
                }}
              >
                <View
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#333",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {`${val} m (${feet}'${inches}")`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </FullScreenModal>

      {/* Height Selection Button */}
      <TouchableOpacity onPress={() => setHeightModalVisible(true)}>
        <View style={styles.button}>
          <Text style={{ fontSize: 18 }}>
            <Text style={{ color: "orange" }}>Select Height: </Text>
            <Text style={{ color: "white" }}>
              {formatMetersToFeetInches(hardware.height)}
            </Text>
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      {/* Height Selection Modal */}
      <FullScreenModal
        visible={isHeightModalVisible}
        onRequestClose={() => setHeightModalVisible(false)}
        title="Select Height (meters):"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {widthOptions.map((val) => {
            const numericVal = Number(val);
            const totalInches = numericVal * 39.3701;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);

            return (
              <TouchableOpacity
                key={val}
                onPress={() => {
                  hardware.setHeight(numericVal); // <-- FIXED
                  setHeightModalVisible(false);
                }}
              >
                <View
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#333",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {`${val} m (${feet}'${inches}")`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </FullScreenModal>

      
    </View>
  );
});

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
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#19191a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
});
