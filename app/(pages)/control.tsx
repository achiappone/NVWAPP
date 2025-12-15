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

export default observer(function Control() {
  const { control } = useStore();

  console.log(
    "Control: " + "\n",
    "Processor: " + control.processorModel + "\n",
    "Resolution: " + control.sourceResolution + "\n",
    "Refresh Rate: " + control.refreshRate + "\n",
    "Bit Depth: " + control.bitDepth + "\n",
    "HDR: " + control.hdr
  );

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
  const refreshRateOptions = ["25", "30", "50", "60", "75", "120"];
  const bitDepthOptions = ["8", "10", "12"];
  const yesNoOptions = ["Yes", "No"];

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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
          {refreshRateOptions.map((val) => (
            <ModalOption
              key={val}
              label={val + " Hz"}
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
          {bitDepthOptions.map((val) => (
            <ModalOption
              key={val}
              label={val + "-bit"}
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
          >
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
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  label: {
    color: "orange",
  },
});
