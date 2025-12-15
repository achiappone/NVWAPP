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
import LabeledValue from "../components/LabeledValue";
import ModalOption from "../components/ModalOption";

export default observer(function Hardware() {

    // access hardware store values
  const { hardware } = useStore();

  const [isWidthModalVisible, setWidthModalVisible] = useState(false);
  const [isHeightModalVisible, setHeightModalVisible] = useState(false);
  const [isPixelPitchModalVisible, setPixelPitchModalVisible] = useState(false);
  const [isApplicationModalVisible, setApplicationModalVisible] = useState(false);
  
  console.log(
  "Application: " + "\n",
  "Pixel Pitch: " + hardware.pixelPitch + "\n",
  "Width: " + hardware.width + "\n",
  "Height: " + hardware.height + "\n"
  );

  // width list
  const widthOptions = [
    "0.0",
    ...Array.from({ length: 60 }, (_, i) => (0.5 * (i + 1)).toFixed(1)),
  ];

    // height list
  const heightOptions = [
    "0.0",
    ...Array.from({ length: 60 }, (_, i) => (0.5 * (i + 1)).toFixed(1)),
  ];

  /** Convert meters → feet/inches */
  const METERS_PER_INCH = 0.0254;

  const formatMetersToFeetInches = (meters: number) => {
    const totalInches = meters / METERS_PER_INCH;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${meters} m (${feet}'${inches}")`;
  };




  const applicationOptions = ["Rental", "Installation"] as const;
  const pixelPitchOptions = ["1.9", "2.6", "3.9",];


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware Configuration</Text>

      {/* Application Selection Button */}
      <TouchableOpacity onPress={() => setApplicationModalVisible(true)}>
        <View style={styles.button}>
          <LabeledValue
            label="Application: "
            value={hardware.application || "Select"}
          />
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      {/* Application Selection Modal */}
      <FullScreenModal
        visible={isApplicationModalVisible}
        onRequestClose={() => setApplicationModalVisible(false)}
        title="Select Application:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {applicationOptions.map((val) =>(
            <ModalOption
              key={val}
              label={val}
              onPress={() => {
                hardware.setApplication(val);
                setApplicationModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* PixelPitch Selection Button */}
      <TouchableOpacity onPress={() => setPixelPitchModalVisible(true)}>
        <View style={styles.button}>
          <LabeledValue
            label="Pixel Pitch: "
            value={hardware.pixelPitch ? `${hardware.pixelPitch} mm` : "Select"}
          />
          <ArrowIcon />
        </View>
      </TouchableOpacity>
      
      {/* PixelPitch Selection Modal */}
      <FullScreenModal
        visible={isPixelPitchModalVisible}
        onRequestClose={() => setPixelPitchModalVisible(false)}
        title="Select Pixel Pitch:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {pixelPitchOptions.map((val) =>(
            <ModalOption
              key={val}
              label={`${val} mm`}
              onPress={() => {
                hardware.setPitch(Number(val));
                setPixelPitchModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>
      
      {/* Width Selection Button */}
      <TouchableOpacity onPress={() => setWidthModalVisible(true)}>
        <View style={styles.button}>
          <LabeledValue
            label="Width: "
            value={formatMetersToFeetInches(hardware.width)}
          />
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {widthOptions.map((val) =>(
            <ModalOption
              key={val}
              label={formatMetersToFeetInches(Number(val))}
              onPress={() => {
                hardware.setWidth(Number(val));
                setWidthModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Height Selection Button */}
      <TouchableOpacity onPress={() => setHeightModalVisible(true)}>
        <View style={styles.button}>
          <LabeledValue
            label="Height: "
            value={formatMetersToFeetInches(hardware.height)}
          />
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {heightOptions.map((val) =>(
            <ModalOption
              key={val}
              label={formatMetersToFeetInches(Number(val))}
              onPress={() => {
                hardware.setHeight(Number(val));
                setHeightModalVisible(false);
              }}
            />
          ))}
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
