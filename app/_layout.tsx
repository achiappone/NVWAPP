import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StoreProvider } from "../store/StoreProvider";
import BottomNavWithProgress from "./components/BottomNavWithProgress";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <StoreProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </StoreProvider>

      {/* Render bottom navigation on EVERY screen */}
      <BottomNavWithProgress />
    </>
  );
}
