import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import BottomNavWithProgress from "./components/BottomNavWithProgress";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      {/* Render bottom navigation on EVERY screen */}
      <BottomNavWithProgress />
    </>
  );
}
