import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import BottomNavWithProgress from "../components/BottomNavWithProgress";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <BottomNavWithProgress
        onPressNext={() => router.push("/hardware")}
        progress={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { color: "#fff", fontSize: 28, marginBottom: 20 },
});
