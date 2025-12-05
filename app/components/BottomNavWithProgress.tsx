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

//
// ✔ Update this if your home is not /home
//
const workflow = [
  "/home",
  "/hardware",
  "/control",
  "/cables",
  "/preview"
];

const BottomNavWithProgress = () => {
  const pathname = usePathname();

  // Find current step inside workflow
  const currentIndex = workflow.indexOf(pathname);

  // Safety: if user is on a non-workflow page (like Repository), hide the bar
  if (currentIndex === -1) {
    return null;
  }

  const isHome = currentIndex === 0;
  const isLast = currentIndex === workflow.length - 1;
  const isPreview = pathname === "/preview";

  // Auto progress value based on step
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

        {/* BACK (hidden on home) */}
        {!isHome && (
          <TouchableOpacity onPress={handleBack} style={styles.navButton}>
            <BackIcon />
            <Text style={styles.label}>Back</Text>
          </TouchableOpacity>
        )}

        {/* HOME */}
        <TouchableOpacity onPress={handleHome} style={styles.navButton}>
          <HomeIcon />
          <Text style={styles.label}>Home</Text>
        </TouchableOpacity>

        {/* NEXT (hidden on preview / last screen) */}
        {!isLast && !isPreview && (
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <NextIcon />
            <Text style={styles.label}>Next</Text>
          </TouchableOpacity>
        )}

        {/* EXPORT (ONLY visible on preview) */}
        {isPreview && (
          <TouchableOpacity onPress={() => console.log("Export")} style={styles.navButton}>
            <ExportIcon />
            <Text style={styles.label}>Export</Text>
          </TouchableOpacity>
        )}

        {/* EDIT (ONLY visible on preview) */}
        {isPreview && (
          <TouchableOpacity onPress={() => console.log("Edit")} style={styles.navButton}>
            <EditIcon />
            <Text style={styles.label}>Edit</Text>
          </TouchableOpacity>
        )}

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
    paddingBottom: 30,
    paddingTop: 10,
    borderTopColor: "#222",
    borderTopWidth: 1
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingBottom: 8
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
