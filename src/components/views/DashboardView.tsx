"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { StatBox, StatBoxUSD } from "@/components/ui/StatBox";
import { formatUSD, formatPercent, getChangeColor, cn } from "@/lib/utils";
import type { CoinMarket, GlobalMarket, FearGreedData } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { TrendingUp, TrendingDown } from "lucide-react";

export function DashboardView() {
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [global, setGlobal] = useState<GlobalMarket | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCoin, setActiveView } = useApp();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [marketsRes, fgRes] = await Promise.all([
        fetch("/api/markets"),
        fetch("/api/fear-greed"),
      ]);
      const marketsData = await marketsRes.json();
      const fgData = await fgRes.json();
      setMarkets(marketsData.markets || []);
      setGlobal(marketsData.global || null);
      setFearGreed(fgData.data || []);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  const currentFG = fearGreed[0];
  const fgValue = currentFG ? parseInt(currentFG.value) : 50;
  const gainers = [...markets]
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h || 0) -
        (a.price_change_percentage_24h || 0)
    )
    .slice(0, 8);
  const losers = [...markets]
    .sort(
      (a, b) =>
        (a.price_change_percentage_24h || 0) -
        (b.price_change_percentage_24h || 0)
    )
    .slice(0, 8);

  const fgChart = fearGreed
    .slice(0, 14)
    .reverse()
    .map((d) => ({
      date: new Date(parseInt(d.timestamp) * 1000).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      value: parseInt(d.value),
    }));

  if (loading && !markets.length) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        Loading market data...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatBoxUSD
          label="Total Market Cap"
          value={global?.total_market_cap?.usd || 0}
          change={global?.market_cap_change_percentage_24h_usd}
        />
        <StatBoxUSD
          label="24h Volume"
          value={global?.total_volume?.usd || 0}
        />
        <StatBox
          label="BTC Dominance"
          value={`${(global?.market_cap_percentage?.btc || 0).toFixed(1)}%`}
        />
        <StatBox
          label="Active Cryptos"
          value={String(global?.active_cryptocurrencies || 0)}
          sub={`${global?.markets || 0} markets`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Fear & Greed Index" className="lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="relative mb-4 flex h-32 w-32 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-zinc-200 dark:text-zinc-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={getFGColor(fgValue)}
                  strokeWidth="8"
                  strokeDasharray={`${(fgValue / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-bold">{fgValue}</p>
                <p className="text-xs text-zinc-500">
                  {currentFG?.value_classification || "Neutral"}
                </p>
              </div>
            </div>
            {fgChart.length > 0 && (
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={fgChart}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    fill="#10b98120"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card title="Market Condition" className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-4">
            <ConditionBadge
              label="Trend"
              value={
                (global?.market_cap_change_percentage_24h_usd || 0) >= 0
                  ? "Bullish"
                  : "Bearish"
              }
              positive={
                (global?.market_cap_change_percentage_24h_usd || 0) >= 0
              }
            />
            <ConditionBadge
              label="Sentiment"
              value={currentFG?.value_classification || "Neutral"}
              positive={fgValue > 50}
            />
            <ConditionBadge
              label="Volatility"
              value={
                Math.abs(global?.market_cap_change_percentage_24h_usd || 0) > 3
                  ? "High"
                  : "Moderate"
              }
              positive={false}
            />
          </div>
          <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {getMarketSummary(global, fgValue)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MoverTable
          title="Top Gainers (24h)"
          coins={gainers}
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          onSelect={(symbol) => {
            setSelectedCoin(symbol);
            setActiveView("coins");
          }}
        />
        <MoverTable
          title="Top Losers (24h)"
          coins={losers}
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          onSelect={(symbol) => {
            setSelectedCoin(symbol);
            setActiveView("coins");
          }}
        />
      </div>
    </div>
  );
}

function getFGColor(value: number) {
  if (value <= 25) return "#ef4444";
  if (value <= 45) return "#f97316";
  if (value <= 55) return "#eab308";
  if (value <= 75) return "#84cc16";
  return "#22c55e";
}

function getMarketSummary(global: GlobalMarket | null, fg: number) {
  const change = global?.market_cap_change_percentage_24h_usd || 0;
  if (change > 2 && fg > 60)
    return "Market is in a strong bullish phase with elevated greed. Consider taking profits on overextended positions.";
  if (change > 0 && fg > 50)
    return "Market showing positive momentum with moderate optimism. Watch for continuation patterns.";
  if (change < -2 && fg < 40)
    return "Market under pressure with fear dominating. Potential accumulation zone for long-term holders.";
  if (change < 0)
    return "Market experiencing a pullback. Monitor key support levels and sector rotation.";
  return "Market is consolidating. Range-bound trading likely until a catalyst emerges.";
}

function ConditionBadge({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={cn(
          "mt-1 font-semibold",
          positive ? "text-emerald-500" : "text-orange-500"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MoverTable({
  title,
  coins,
  icon,
  onSelect,
}: {
  title: string;
  coins: CoinMarket[];
  icon: React.ReactNode;
  onSelect: (symbol: string) => void;
}) {
  return (
    <Card title={title} action={icon}>
      <div className="space-y-1">
        {coins.map((coin) => (
          <button
            key={coin.id}
            onClick={() => onSelect(coin.symbol.toUpperCase())}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <img src={coin.image} alt="" className="h-6 w-6 rounded-full" />
              <span className="font-medium text-zinc-900 dark:text-white">
                {coin.symbol.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm">{formatUSD(coin.current_price)}</p>
              <p
                className={cn(
                  "text-xs font-medium",
                  getChangeColor(coin.price_change_percentage_24h || 0)
                )}
              >
                {formatPercent(coin.price_change_percentage_24h || 0)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
