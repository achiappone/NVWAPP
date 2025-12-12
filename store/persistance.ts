import AsyncStorage from "@react-native-async-storage/async-storage";
import { onSnapshot } from "mobx-state-tree";

const STORAGE_KEY = "NVWAPP_ROOT_STORE";

export async function loadStoreSnapshot() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.warn("Failed to load store snapshot", err);
    return null;
  }
}

export function persistStore(store: any) {
  onSnapshot(store, (snapshot) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  });
}
