import { applySnapshot } from "mobx-state-tree";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createRootStore } from "./RootStore";
import { loadStoreSnapshot, persistStore } from "./persistance";

type RootInstance = ReturnType<typeof createRootStore>;

const StoreContext = createContext<RootInstance | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store, setStore] = useState<RootInstance | null>(null);

  useEffect(() => {
    async function init() {
      // 1️⃣ Create empty store
      const rootStore = createRootStore();

      // 2️⃣ Load snapshot
      const snapshot = await loadStoreSnapshot();

      // 3️⃣ Apply snapshot (if it exists)
      if (snapshot) {
        try {
          applySnapshot(rootStore, snapshot);
        } catch (err) {
          console.warn("Failed to apply store snapshot", err);
        }
      }

      // 4️⃣ Ensure at least one project AFTER hydration
      rootStore.ensureDefaultProject();

      // 5️⃣ Start persistence AFTER hydration
      persistStore(rootStore);

      setStore(rootStore);
    }

    init();
  }, []);

  if (!store) return null; // optional loading UI

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider is missing");
  return store;
};
