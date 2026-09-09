"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatPercent, formatUSD, getChangeColor, cn } from "@/lib/utils";
import type { CoinMarket, Sector } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { ArrowUp, ArrowDown } from "lucide-react";

export function ScannerView() {
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCoin, setActiveView } = useApp();

  useEffect(() => {
    async function load() {
      const [marketsRes, sectorsRes] = await Promise.all([
        fetch("/api/markets"),
        fetch("/api/sectors"),
      ]);
      const m = await marketsRes.json();
      const s = await sectorsRes.json();
      setMarkets(m.markets || []);
      setSectors(Array.isArray(s) ? s : []);
      setLoading(false);
    }
    load();
  }, []);

  const strongSectors = [...sectors]
    .sort((a, b) => (b.market_cap_change_24h || 0) - (a.market_cap_change_24h || 0))
    .slice(0, 6);
  const weakSectors = [...sectors]
    .sort((a, b) => (a.market_cap_change_24h || 0) - (b.market_cap_change_24h || 0))
    .slice(0, 6);

  const pumping = [...markets]
    .filter((c) => (c.price_change_percentage_24h || 0) > 5)
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h || 0) -
        (a.price_change_percentage_24h || 0)
    )
    .slice(0, 15);

  const dumping = [...markets]
    .filter((c) => (c.price_change_percentage_24h || 0) < -3)
    .sort(
      (a, b) =>
        (a.price_change_percentage_24h || 0) -
        (b.price_change_percentage_24h || 0)
    )
    .slice(0, 15);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        Scanning markets...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Strong Sectors" action={<ArrowUp className="h-4 w-4 text-emerald-500" />}>
          <div className="space-y-2">
            {strongSectors.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-emerald-500/5 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {s.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {s.top_3_coins?.join(", ")}
                  </p>
                </div>
                <span className="font-semibold text-emerald-500">
                  {formatPercent(s.market_cap_change_24h || 0)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Weak Sectors" action={<ArrowDown className="h-4 w-4 text-red-500" />}>
          <div className="space-y-2">
            {weakSectors.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-red-500/5 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {s.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {s.top_3_coins?.join(", ")}
                  </p>
                </div>
                <span className="font-semibold text-red-500">
                  {formatPercent(s.market_cap_change_24h || 0)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CoinScannerTable
          title="Pumping Hard"
          subtitle="Coins with highest 24h gains"
          coins={pumping}
          onSelect={(sym) => {
            setSelectedCoin(sym);
            setActiveView("coins");
          }}
        />
        <CoinScannerTable
          title="Dumping Hard"
          subtitle="Coins with highest 24h losses"
          coins={dumping}
          onSelect={(sym) => {
            setSelectedCoin(sym);
            setActiveView("coins");
          }}
        />
      </div>
    </div>
  );
}

function CoinScannerTable({
  title,
  subtitle,
  coins,
  onSelect,
}: {
  title: string;
  subtitle: string;
  coins: CoinMarket[];
  onSelect: (symbol: string) => void;
}) {
  return (
    <Card title={title}>
      <p className="-mt-2 mb-3 text-xs text-zinc-500">{subtitle}</p>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-700">
              <th className="pb-2">Coin</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">24h</th>
              <th className="pb-2">Volume</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => onSelect(coin.symbol.toUpperCase())}
                className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={coin.image}
                      alt=""
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="font-medium">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-2">{formatUSD(coin.current_price)}</td>
                <td
                  className={cn(
                    "py-2 font-medium",
                    getChangeColor(coin.price_change_percentage_24h || 0)
                  )}
                >
                  {formatPercent(coin.price_change_percentage_24h || 0)}
                </td>
                <td className="py-2 text-zinc-500">
                  {formatUSD(coin.total_volume, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coins.length === 0 && (
          <p className="py-8 text-center text-zinc-500">No coins match criteria</p>
        )}
      </div>
    </Card>
  );
}
