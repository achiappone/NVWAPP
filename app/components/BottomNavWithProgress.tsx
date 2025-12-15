import { router, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
              onPress={() => console.log("Edit")}
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
  }
});
