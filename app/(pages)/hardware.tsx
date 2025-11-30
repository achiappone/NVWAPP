import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomNavWithProgress from "../components/BottomNavWithProgress";
import HardwarePopup from "../components/Popups/HardwarePopup";

export default function Hardware() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware Configuration</Text>

      {showPopup && (
        <HardwarePopup onClose={() => setShowPopup(false)} />
      )}

      <BottomNavWithProgress
        onPressBack={() => router.push("/home")}
        onPressNext={() => router.push("/control")}
        onPressHome={() => router.push("/home")}
        onPressEdit={() => setShowPopup(true)}
        progress={0.25}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { color: "#fff", fontSize: 28, marginBottom: 20 },
});
