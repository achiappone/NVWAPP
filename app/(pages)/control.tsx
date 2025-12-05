import { StyleSheet, Text, View } from "react-native";

export default function control() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { color: "#fff", fontSize: 28, marginBottom: 20 },
});