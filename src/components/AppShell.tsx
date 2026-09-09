"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CalculatorPanel } from "@/components/layout/CalculatorPanel";
import { useApp } from "@/context/AppContext";
import { DashboardView } from "@/components/views/DashboardView";
import { ScannerView } from "@/components/views/ScannerView";
import { HeatmapView } from "@/components/views/HeatmapView";
import { CoinsView } from "@/components/views/CoinsView";
import { WhaleTrackerView } from "@/components/views/WhaleTrackerView";
import { FundingView } from "@/components/views/FundingView";
import { LiquidationsView } from "@/components/views/LiquidationsView";
import { NarrativesView } from "@/components/views/NarrativesView";
import { SocialFeedView } from "@/components/views/SocialFeedView";
import { CorrelationView } from "@/components/views/CorrelationView";
import { ArbitrageView } from "@/components/views/ArbitrageView";
import { SIPCalculatorView } from "@/components/views/SIPCalculatorView";
import { WalletView } from "@/components/views/WalletView";
import type { ViewId } from "@/lib/types";

const VIEW_TITLES: Record<ViewId, string> = {
  dashboard: "Market Dashboard",
  scanner: "Market Scanner",
  heatmap: "Crypto Heat Map",
  coins: "Coin Charts",
  whales: "Whale Tracker",
  funding: "Funding Monitor",
  liquidations: "Liquidations",
  narratives: "Trending Narratives",
  social: "Crypto X Feed",
  correlation: "Correlated Pairs",
  arbitrage: "Arbitrage Scanner",
  calculator: "SIP Calculator",
  wallet: "BingX Wallet",
};

export function AppShell() {
  const { activeView } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={VIEW_TITLES[activeView]} />
        <main className="flex-1 overflow-y-auto">
          <ViewRouter view={activeView} />
        </main>
      </div>
      <CalculatorPanel />
    </div>
  );
}

function ViewRouter({ view }: { view: ViewId }) {
  switch (view) {
    case "dashboard":
      return <DashboardView />;
    case "scanner":
      return <ScannerView />;
    case "heatmap":
      return <HeatmapView />;
    case "coins":
      return <CoinsView />;
    case "whales":
      return <WhaleTrackerView />;
    case "funding":
      return <FundingView />;
    case "liquidations":
      return <LiquidationsView />;
    case "narratives":
      return <NarrativesView />;
    case "social":
      return <SocialFeedView />;
    case "correlation":
      return <CorrelationView />;
    case "arbitrage":
      return <ArbitrageView />;
    case "calculator":
      return <SIPCalculatorView />;
    case "wallet":
      return <WalletView />;
    default:
      return <DashboardView />;
  }
}
