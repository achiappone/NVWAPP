import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import HardwarePopup from "../components/Popups/HardwarePopup";

export default function hardware() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware Configuration</Text>

      {showPopup && (
        <HardwarePopup onClose={() => setShowPopup(false)} />
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { color: "#fff", fontSize: 28, marginBottom: 20 },
});
