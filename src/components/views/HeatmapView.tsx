"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatPercent } from "@/lib/utils";
import type { CoinMarket } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export function HeatmapView() {
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const { setSelectedCoin, setActiveView } = useApp();

  useEffect(() => {
    fetch("/api/markets")
      .then((r) => r.json())
      .then((d) => setMarkets(d.markets?.slice(0, 50) || []));
  }, []);

  const maxCap = Math.max(...markets.map((m) => m.market_cap || 1));

  function getHeatColor(change: number) {
    if (change >= 10) return "bg-emerald-600 text-white";
    if (change >= 5) return "bg-emerald-500 text-white";
    if (change >= 2) return "bg-emerald-400 text-white";
    if (change >= 0) return "bg-emerald-300 text-zinc-900";
    if (change >= -2) return "bg-red-300 text-zinc-900";
    if (change >= -5) return "bg-red-400 text-white";
    if (change >= -10) return "bg-red-500 text-white";
    return "bg-red-600 text-white";
  }

  return (
    <div className="p-6">
      <Card title="Crypto Heat Map">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Size = market cap · Color = 24h change · Click a tile to open chart
        </p>
        <div className="flex flex-wrap gap-1">
          {markets.map((coin) => {
            const sizeRatio = (coin.market_cap / maxCap) * 100;
            const minW = Math.max(80, sizeRatio * 2.5);
            const minH = Math.max(60, sizeRatio * 1.5);
            const change = coin.price_change_percentage_24h || 0;

            return (
              <button
                key={coin.id}
                onClick={() => {
                  setSelectedCoin(coin.symbol.toUpperCase());
                  setActiveView("coins");
                }}
                className={`flex flex-col items-center justify-center rounded-lg p-2 transition-transform hover:scale-105 ${getHeatColor(change)}`}
                style={{ minWidth: minW, minHeight: minH }}
              >
                <span className="text-xs font-bold">
                  {coin.symbol.toUpperCase()}
                </span>
                <span className="text-[10px] opacity-90">
                  {formatPercent(change)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-red-500" /> Dumping
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-zinc-300" /> Flat
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-emerald-500" /> Pumping
          </span>
        </div>
      </Card>
    </div>
  );
}
