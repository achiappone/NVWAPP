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

export default observer(function Cables() {
   // access cables store values
    const store = useStore();
    const project = store.activeProject;
  
    if (!project) {
      return null;
    }
  
    const { cables } = project;

  console.log(
    "Cables:" + "\n",
    "Signal Type:" + cables.signalType + "\n",
    "Signal Length:" + cables.signalLength + "\n",
    "Power Type:" + cables.powerType + "\n",
    "Power Length:" + cables.powerLength + "\n",
    "Home Run:" + cables.homeRun + "\n",
    "Input Voltage:" + cables.voltageInput + "\n"
  );

  const [isSignalTypeVisible, setSignalTypeVisible] = useState(false);
  const [isSignalLengthVisible, setSignalLengthVisible] = useState(false);
  const [isPowerTypeVisible, setPowerTypeVisible] = useState(false);
  const [isPowerLengthVisible, setPowerLengthVisible] = useState(false);
  const [isHomeRunVisible, setHomeRunVisible] = useState(false);
  const [isVoltageModalVisible, setVoltageModalVisible] = useState(false);

  const signalTypeOptions = ["Ethernet", "Fiber"];
  const powerTypeOptions = ["TRUE1", "BareEnd", "IEC"];
  const yesNoOptions = ["Yes", "No"];
  const [lengthUnit, setLengthUnit] = useState<"m" | "ft">("ft");
  
  /** Convert meters → feet/inches */
  const formatMetersToFeetInches = (meters: number) => {
    const totalInches = meters * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${meters} m (${feet}'${inches}")`;
  };

  const METERS_PER_FOOT = 0.3048;

  const metersToFeet = (m: number) =>
    Math.round(m / METERS_PER_FOOT);

  const feetToMeters = (ft: number) =>
    +(ft * METERS_PER_FOOT).toFixed(2);

  // UI options: 5 ft increments up to 2500 ft
    const lengthOptions = Array.from(
      { length: 2500 / 5 },
      (_, i) => (i + 1) * 5
    );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cable Configuration</Text>

      {/* Signal Type */}
      <TouchableOpacity onPress={() => setSignalTypeVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Signal Type: </Text>
            {cables.signalType}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isSignalTypeVisible}
        onRequestClose={() => setSignalTypeVisible(false)}
        title="Select Signal Type:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
          {signalTypeOptions.map((val) => (
            <ModalOption
              key={val}
              label={val}
              onPress={() => {
                cables.setSignalType(val as "Ethernet" | "Fiber");
                setSignalTypeVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Signal Length */}
      <TouchableOpacity onPress={() => setSignalLengthVisible(true)}>
        <View style={styles.button}>
          <LabeledValue
            label="Signal Length: "
            value={formatMetersToFeetInches(cables.signalLength)}
          />
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isSignalLengthVisible}
        onRequestClose={() => setSignalLengthVisible(false)}
        title="Select Signal Length:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {lengthOptions.map((val) => (
            <ModalOption
              key={val}
              label={formatMetersToFeetInches(Number(val))}
              onPress={() => {
                cables.setSignalLength(Number(val));
                setSignalLengthVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Input Voltage */}
      <TouchableOpacity onPress={() => setVoltageModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Mains Voltage: </Text>
            {cables.voltageInput}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isVoltageModalVisible}
        onRequestClose={() => setVoltageModalVisible(false)}
        title="Select Mains Voltage:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          <ModalOption
            label="120 V"
            onPress={() => {
              cables.setVoltageInput(120);
              setVoltageModalVisible(false);
            }}
          />

          <ModalOption
            label="208 V"
            onPress={() => {
              cables.setVoltageInput(208);
              setVoltageModalVisible(false);
            }}
          />

          <ModalOption
            label="230 V"
            onPress={() => {
              cables.setVoltageInput(230);
              setVoltageModalVisible(false);
            }}
          />
        </ScrollView>
      </FullScreenModal>
      
      {/* Power Type */}
      <TouchableOpacity onPress={() => setPowerTypeVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Power Type: </Text>
            {cables.powerType}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isPowerTypeVisible}
        onRequestClose={() => setPowerTypeVisible(false)}
        title="Select Power Type:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}>
          {powerTypeOptions.map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => {
                cables.setPowerType(val as "TRUE1" | "BareEnd" | "IEC");
                setPowerTypeVisible(false);
              }}
            >
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{val}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Power Length */}
      <TouchableOpacity onPress={() => setPowerLengthVisible(true)}>
        <View style={styles.button}>
          <LabeledValue
            label="Power Length: "
            value={formatMetersToFeetInches(cables.powerLength)}
          />
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isPowerLengthVisible}
        onRequestClose={() => setPowerLengthVisible(false)}
        title="Select Power Length:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {lengthOptions.map((val) =>(
            <ModalOption
              key={val}
              label={formatMetersToFeetInches(Number(val))}
              onPress={() => {
                cables.setPowerLength(Number(val));
                setPowerLengthVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Home Run */}
      <TouchableOpacity onPress={() => setHomeRunVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Home Run: </Text>
            {cables.homeRun ? "Yes" : "No"}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isHomeRunVisible}
        onRequestClose={() => setHomeRunVisible(false)}
        title="Home Run Cabling?"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
          {yesNoOptions.map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => {
                cables.setHomeRun(val === "Yes");
                setHomeRunVisible(false);
              }}
            >
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{val}</Text>
              </View>
            </TouchableOpacity>
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
    padding: 15,
    paddingTop: 30,
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
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  label: {
    color: "orange",
  },
  modalRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalText: {
    color: "white",
    fontSize: 18,
  },
});
