import React, { createContext, useContext, useEffect, useState } from "react";
import { createRootStore } from "./RootStore";
import { loadStoreSnapshot, persistStore } from "./persistance";

type RootInstance = ReturnType<typeof createRootStore>;

const StoreContext = createContext<RootInstance | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store, setStore] = useState<RootInstance | null>(null);

  useEffect(() => {
    async function init() {
      const snapshot = await loadStoreSnapshot();
      const rootStore = createRootStore(snapshot ?? undefined);
      persistStore(rootStore);
      setStore(rootStore);
    }

    init();
  }, []);

  if (!store) return null; // or a loading screen

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
