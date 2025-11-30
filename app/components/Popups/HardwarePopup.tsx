import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HardwarePopup({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.title}>Hardware Options</Text>

        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  title: { color: "#fff", fontSize: 20, marginBottom: 15 },
  button: {
    marginTop: 20,
    backgroundColor: "#444",
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center" },
});
