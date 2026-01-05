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
import ModalOption from "../components/ModalOption";

import { PROCESSORS } from "@/constants/processors";
import { calculateA10sProControlLoad } from "@/utils/control/a10sProCapacity";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function normalizeProcessorModel(
  label: string
): keyof typeof PROCESSORS | null {
  if (label.includes("MX20")) return "MX20";
  if (label.includes("MX30")) return "MX30";
  if (label.includes("MX40")) return "MX40 Pro";
  return null;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default observer(function Control() {
  const store = useStore();
  const project = store.activeProject;

  if (!project) {
    return null;
  }

  const { control, hardware } = project;

  // ----------------------------------------------------------
  // Pixel math (NO cabinet concept yet)
  // ----------------------------------------------------------

  const totalScreenPixels =
    hardware.width && hardware.height && hardware.pixelPitch
      ? Math.round(
          ((hardware.width * 1000) / hardware.pixelPitch) *
            ((hardware.height * 1000) / hardware.pixelPitch)
        )
      : 0;

  // ----------------------------------------------------------
  // Processor + control sizing
  // ----------------------------------------------------------

  const processorKey = normalizeProcessorModel(control.processorModel);
  const processorSpec = processorKey ? PROCESSORS[processorKey] : null;

  const controlSizing =
    processorSpec && totalScreenPixels > 0
      ? calculateA10sProControlLoad({
          totalScreenPixels,
          cabinetPixels: 1, // placeholder until cabinets exist
          frameRateHz: control.refreshRate as
            | 24
            | 25
            | 30
            | 50
            | 60
            | 120
            | 144
            | 240,
          bitDepth: control.bitDepth as 8 | 10 | 12,
          portsPerProcessor: processorSpec.ports,
        })
      : null;

  // ----------------------------------------------------------
  // UI state
  // ----------------------------------------------------------

  const [isProcessorModalVisible, setProcessorModalVisible] = useState(false);
  const [isResolutionModalVisible, setResolutionModalVisible] = useState(false);
  const [isRefreshModalVisible, setRefreshModalVisible] = useState(false);
  const [isBitDepthModalVisible, setBitDepthModalVisible] = useState(false);
  const [isHdrModalVisible, setHdrModalVisible] = useState(false);

  const processorOptions = [
    "Novastar MX20",
    "Novastar MX30",
    "Novastar MX40 Pro",
  ];

  const resolutionOptions = ["HD (1920x1080)", "4K (3840x2160)"];
  const refreshRateOptions = ["24", "25", "30", "50", "60", "120", "144", "240"];
  const bitDepthOptions = ["8", "10", "12"];
  const yesNoOptions = ["Yes", "No"];

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control Configuration</Text>

      {/* Processor */}
      <TouchableOpacity onPress={() => setProcessorModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Processor: </Text>
            {control.processorModel || "Select"}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isProcessorModalVisible}
        onRequestClose={() => setProcessorModalVisible(false)}
        title="Select Processor:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {processorOptions.map((val) => (
            <ModalOption
              key={val}
              label={val}
              onPress={() => {
                control.setProcessorModel(val);
                setProcessorModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Resolution */}
      <TouchableOpacity onPress={() => setResolutionModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Resolution: </Text>
            {control.sourceResolution}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isResolutionModalVisible}
        onRequestClose={() => setResolutionModalVisible(false)}
        title="Select Resolution:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {resolutionOptions.map((val) => (
            <ModalOption
              key={val}
              label={val}
              onPress={() => {
                control.setSourceResolution(val);
                setResolutionModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Refresh Rate */}
      <TouchableOpacity onPress={() => setRefreshModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Refresh Rate: </Text>
            {control.refreshRate} Hz
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isRefreshModalVisible}
        onRequestClose={() => setRefreshModalVisible(false)}
        title="Select Refresh Rate:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {refreshRateOptions.map((val) => (
            <ModalOption
              key={val}
              label={`${val} Hz`}
              onPress={() => {
                control.setRefreshRate(Number(val));
                setRefreshModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Bit Depth */}
      <TouchableOpacity onPress={() => setBitDepthModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>Bit Depth: </Text>
            {control.bitDepth}-bit
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isBitDepthModalVisible}
        onRequestClose={() => setBitDepthModalVisible(false)}
        title="Select Bit Depth:"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {bitDepthOptions.map((val) => (
            <ModalOption
              key={val}
              label={`${val}-bit`}
              onPress={() => {
                control.setBitDepth(Number(val));
                setBitDepthModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* HDR */}
      <TouchableOpacity onPress={() => setHdrModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={styles.label}>HDR: </Text>
            {control.hdr ? "Yes" : "No"}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      <FullScreenModal
        visible={isHdrModalVisible}
        onRequestClose={() => setHdrModalVisible(false)}
        title="HDR Enabled?"
        animationType={ModalAnimationType.Fade}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {yesNoOptions.map((val) => (
            <ModalOption
              key={val}
              label={val}
              onPress={() => {
                control.setHdr(val === "Yes");
                setHdrModalVisible(false);
              }}
            />
          ))}
        </ScrollView>
      </FullScreenModal>

      {/* Control Load Summary */}
      {controlSizing && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: "orange", fontSize: 20, marginBottom: 10 }}>
            Control Load Summary
          </Text>

          <Text style={styles.summaryText}>
            Ports Required: {controlSizing.portsRequired}
          </Text>

          <Text style={styles.summaryText}>
            Processors Required: {controlSizing.processorsRequired}
          </Text>

          <Text style={styles.summaryText}>
            Overall Utilization:{" "}
            {controlSizing.overallUtilizationPercent.toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
});

// ------------------------------------------------------------
// Styles
// ------------------------------------------------------------

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
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  label: {
    color: "orange",
  },
  modalContent: {
    alignItems: "center",
    width: "100%",
  },
  summaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
