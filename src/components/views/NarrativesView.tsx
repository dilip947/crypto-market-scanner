"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Narrative } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function NarrativesView() {
  const [narratives, setNarratives] = useState<Narrative[]>([]);

  useEffect(() => {
    fetch("/api/narratives")
      .then((r) => r.json())
      .then(setNarratives);
  }, []);

  return (
    <div className="p-6">
      <Card title="Trending Narratives">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Sector narratives and themes driving the market — what could move next
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {narratives.map((n) => (
            <div
              key={n.name}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">
                    {n.name}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-500">{n.description}</p>
                </div>
                <TrendIcon trend={n.trend} />
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-zinc-500">Strength</span>
                  <span>{n.strength.toFixed(0)}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      n.trend === "rising"
                        ? "bg-emerald-500"
                        : n.trend === "falling"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    )}
                    style={{ width: `${n.strength}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {n.coins.map((c) => (
                  <span
                    key={c}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "rising")
    return <TrendingUp className="h-5 w-5 text-emerald-500" />;
  if (trend === "falling")
    return <TrendingDown className="h-5 w-5 text-red-500" />;
  return <Minus className="h-5 w-5 text-yellow-500" />;
}
