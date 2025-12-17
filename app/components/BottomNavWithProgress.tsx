// app/components/BottomNavWithProgress.tsx
import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import {
  BackIcon,
  EditIcon,
  ExportIcon,
  HomeIcon,
  NextIcon
} from "../../assets/icons/svgIcons";

const workflow = [
  "/home",
  "/hardware",
  "/control",
  "/cables",
  "/preview"
];

const BottomNavWithProgress = () => {
  const pathname = usePathname();
  const currentIndex = workflow.indexOf(pathname);
  const [isEditModalVisible, setEditModalVisible] = useState(false);


  // Hide bar on non-workflow pages
  if (currentIndex === -1) {
    return null;
  }

  const isHome = currentIndex === 0;
  const isLast = currentIndex === workflow.length - 1;
  const isPreview = pathname === "/preview";

  const progress = currentIndex / (workflow.length - 1);

  const handleNext = () => {
    if (!isLast) {
      router.push(workflow[currentIndex + 1] as any);
    }
  };

  const handleBack = () => {
    if (!isHome) {
      router.push(workflow[currentIndex - 1] as any);
    }
  };

  const handleHome = () => router.push("/home");

  return (
    <>
    <View style={styles.wrapper}>
      <View style={styles.navContainer}>

        {/* SLOT 1 — BACK */}
        <View style={styles.slot}>
          {!isHome && (
            <TouchableOpacity onPress={handleBack} style={styles.navButton}>
              <BackIcon />
              <Text style={styles.label}>Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SLOT 2 — HOME (FIXED POSITION) */}
        <View style={styles.slot}>
          <TouchableOpacity onPress={handleHome} style={styles.navButton}>
            <HomeIcon />
            <Text style={styles.label}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* SLOT 3 — NEXT */}
        <View style={styles.slot}>
          {!isLast && !isPreview && (
            <TouchableOpacity onPress={handleNext} style={styles.navButton}>
              <NextIcon />
              <Text style={styles.label}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SLOT 4 — EXPORT */}
        <View style={styles.slot}>
          {isPreview && (
            <TouchableOpacity
              onPress={() => console.log("Export")}
              style={styles.navButton}
            >
              <ExportIcon />
              <Text style={styles.label}>Export</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SLOT 5 — EDIT */}
        <View style={styles.slot}>
          {isPreview && (
            <TouchableOpacity
              onPress={() => {
                console.log("Edit")
                setEditModalVisible(true);
              }}
              style={styles.navButton}
            >
              <EditIcon />
              <Text style={styles.label}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={320}
          height={6}
          borderWidth={0}
          color="#FFFFFF"
          unfilledColor="#333"
          borderRadius={5}
        />
      </View>
    </View>

    <Modal
      transparent
      animationType="fade"
      visible={isEditModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Edit Configuration</Text>

          <Pressable
            onPress={() => {
              setEditModalVisible(false);
              router.push("/hardware");
            }}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
            ]}
          >
            <Text style={styles.optionText}>Screen / Hardware</Text>
          </Pressable>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              setEditModalVisible(false);
              router.push("/control");
            }}
          >
            <Text style={styles.optionText}>Control</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              setEditModalVisible(false);
              router.push("/cables");
            }}
          >
            <Text style={styles.optionText}>Cables</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancel}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </>
  );
};

export default BottomNavWithProgress;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#101010",
    paddingTop: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#222"
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 8
  },
  slot: {
    flex: 1,
    alignItems: "center"
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60
  },
  label: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4
  },
  progressContainer: {
    marginTop: 8,
    alignItems: "center"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#101010",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF8C00",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "#101010", // base
    borderBottomWidth: 1,
    borderBottomColor: "#333",
},
  optionText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  cancel: {
    marginTop: 16,
    paddingVertical: 12,
  },
  cancelText: {
    textAlign: "center",
    color: "#FF8C00",
  },
  optionPressed: {
  backgroundColor: "#1E1E1E",
},

});
