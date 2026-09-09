"use client";

import {
  LayoutDashboard,
  ScanSearch,
  Grid3X3,
  Coins,
  Waves,
  TrendingUp,
  Droplets,
  Flame,
  MessageCircle,
  GitCompare,
  ArrowLeftRight,
  Calculator,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/lib/types";

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scanner", label: "Market Scanner", icon: ScanSearch },
  { id: "heatmap", label: "Heat Map", icon: Grid3X3 },
  { id: "coins", label: "All Coins", icon: Coins },
  { id: "whales", label: "Whale Tracker", icon: Waves },
  { id: "funding", label: "Funding Monitor", icon: TrendingUp },
  { id: "liquidations", label: "Liquidations", icon: Droplets },
  { id: "narratives", label: "Narratives", icon: Flame },
  { id: "social", label: "Crypto X Feed", icon: MessageCircle },
  { id: "correlation", label: "Correlated Pairs", icon: GitCompare },
  { id: "arbitrage", label: "Arbitrage", icon: ArrowLeftRight },
  { id: "calculator", label: "SIP Calculator", icon: Calculator },
  { id: "wallet", label: "BingX Wallet", icon: Wallet },
];

export function Sidebar() {
  const { activeView, setActiveView } = useApp();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-5 dark:border-zinc-800">
        <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          CryptoScan
        </h1>
        <p className="text-xs text-zinc-500">Market Intelligence Hub</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={cn(
              "mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              activeView === id
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
