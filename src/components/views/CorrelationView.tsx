"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { CorrelatedPair } from "@/lib/types";

export function CorrelationView() {
  const [pairs, setPairs] = useState<CorrelatedPair[]>([]);

  useEffect(() => {
    fetch("/api/correlation")
      .then((r) => r.json())
      .then(setPairs);
  }, []);

  return (
    <div className="p-6">
      <Card title="Correlated Pairs">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Price correlation between major crypto pairs — useful for hedging and
          pair trading
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {pairs.map((p) => (
            <div
              key={p.pair}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {p.pair}
                </p>
                <span
                  className={cn(
                    "text-xs font-medium capitalize",
                    p.trend === "strong"
                      ? "text-emerald-500"
                      : p.trend === "moderate"
                        ? "text-yellow-500"
                        : "text-zinc-500"
                  )}
                >
                  {p.trend} correlation
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {(p.correlation * 100).toFixed(0)}%
                </p>
                <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${p.correlation * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
