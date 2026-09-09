"use client";

import { Sun, Moon, Calculator, RefreshCw } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function Header({ title, onRefresh, refreshing }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { setCalculatorOpen, calculatorOpen } = useApp();

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Refresh data"
          >
            <RefreshCw
              className={cn("h-5 w-5", refreshing && "animate-spin")}
            />
          </button>
        )}
        <button
          onClick={() => setCalculatorOpen(!calculatorOpen)}
          className={cn(
            "rounded-lg p-2 transition-colors",
            calculatorOpen
              ? "bg-emerald-500/10 text-emerald-600"
              : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
          title="P/L Calculator"
        >
          <Calculator className="h-5 w-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}
