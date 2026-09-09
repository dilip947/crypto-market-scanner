"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatUSD } from "@/lib/utils";
import type { Liquidation } from "@/lib/types";

export function LiquidationsView() {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);

  useEffect(() => {
    const load = () =>
      fetch("/api/liquidations")
        .then((r) => r.json())
        .then(setLiquidations);
    load();
    const i = setInterval(load, 30000);
    return () => clearInterval(i);
  }, []);

  const totalLong = liquidations
    .filter((l) => l.side === "LONG")
    .reduce((s, l) => s + l.value, 0);
  const totalShort = liquidations
    .filter((l) => l.side === "SHORT")
    .reduce((s, l) => s + l.value, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-zinc-500">Long Liquidations</p>
          <p className="text-2xl font-bold text-red-500">
            {formatUSD(totalLong, true)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-sm text-zinc-500">Short Liquidations</p>
          <p className="text-2xl font-bold text-emerald-500">
            {formatUSD(totalShort, true)}
          </p>
        </div>
      </div>

      <Card title="Recent Liquidations">
        <div className="space-y-2">
          {liquidations.map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    l.side === "LONG"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {l.side}
                </span>
                <span className="font-medium">{l.symbol}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatUSD(l.value, true)}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(l.time).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
