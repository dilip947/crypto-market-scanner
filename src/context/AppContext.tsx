"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ViewId } from "@/lib/types";

interface AppContextType {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
  selectedCoin: string | null;
  setSelectedCoin: (symbol: string | null) => void;
  calculatorOpen: boolean;
  setCalculatorOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [selectedCoin, setSelectedCoin] = useState<string | null>("BTC");
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCoin,
        setSelectedCoin,
        calculatorOpen,
        setCalculatorOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
