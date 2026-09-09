"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TradingViewWidget } from "@/components/charts/TradingViewWidget";
import { formatUSD, formatPercent, getChangeColor, cn } from "@/lib/utils";
import type { CoinMarket } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { Search } from "lucide-react";

export function CoinsView() {
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [search, setSearch] = useState("");
  const { selectedCoin, setSelectedCoin } = useApp();

  useEffect(() => {
    fetch("/api/markets")
      .then((r) => r.json())
      .then((d) => setMarkets(d.markets || []));
  }, []);

  const filtered = markets.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const selected = markets.find(
    (c) => c.symbol.toUpperCase() === selectedCoin?.toUpperCase()
  );

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <div className="w-72 shrink-0 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800">
        <div className="sticky top-0 bg-white p-3 dark:bg-zinc-950">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coins..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>
        <div className="p-2">
          {filtered.map((coin) => (
            <button
              key={coin.id}
              onClick={() => setSelectedCoin(coin.symbol.toUpperCase())}
              className={cn(
                "mb-0.5 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
                selectedCoin === coin.symbol.toUpperCase()
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-2">
                <img src={coin.image} alt="" className="h-5 w-5 rounded-full" />
                <span className="font-medium">{coin.symbol.toUpperCase()}</span>
              </div>
              <span
                className={cn(
                  "text-xs",
                  getChangeColor(coin.price_change_percentage_24h || 0)
                )}
              >
                {formatPercent(coin.price_change_percentage_24h || 0)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedCoin ? (
          <>
            <div className="mb-4 flex items-center gap-4">
              {selected && (
                <img
                  src={selected.image}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {selectedCoin}/USDT
                </h3>
                {selected && (
                  <p className="text-zinc-500">
                    {formatUSD(selected.current_price)}{" "}
                    <span
                      className={getChangeColor(
                        selected.price_change_percentage_24h || 0
                      )}
                    >
                      {formatPercent(selected.price_change_percentage_24h || 0)}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <TradingViewWidget symbol={selectedCoin} height={550} />
            <Card title="Quick Analysis" className="mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Use TradingView drawing tools above for trend lines, Fibonacci,
                support/resistance, and pattern analysis. Switch timeframes
                directly on the chart toolbar.
              </p>
            </Card>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            Select a coin from the list to view its chart
          </div>
        )}
      </div>
    </div>
  );
}
