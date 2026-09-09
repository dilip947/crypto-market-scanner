"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatUSD } from "@/lib/utils";
import type { ArbitrageOpportunity } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function ArbitrageView() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);

  useEffect(() => {
    fetch("/api/arbitrage")
      .then((r) => r.json())
      .then(setOpportunities);
    const i = setInterval(
      () => fetch("/api/arbitrage").then((r) => r.json()).then(setOpportunities),
      60000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <div className="p-6">
      <Card title="Arbitrage Opportunities">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Price differences across exchanges — buy low, sell high (before fees)
        </p>
        <div className="space-y-3">
          {opportunities.map((o, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <span className="rounded-lg bg-emerald-500/10 px-3 py-1 font-bold text-emerald-600">
                  {o.coin}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">{o.exchangeA}</span>
                  <span className="font-medium">{formatUSD(o.priceA)}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-500">{o.exchangeB}</span>
                  <span className="font-medium">{formatUSD(o.priceB)}</span>
                </div>
              </div>
              <span className="rounded-lg bg-emerald-500 px-3 py-1 text-sm font-bold text-white">
                +{o.spreadPercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
