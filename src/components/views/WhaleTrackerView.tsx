"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatUSD } from "@/lib/utils";
import type { WhaleTransaction } from "@/lib/types";
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";

export function WhaleTrackerView() {
  const [whales, setWhales] = useState<WhaleTransaction[]>([]);

  useEffect(() => {
    fetch("/api/whales")
      .then((r) => r.json())
      .then(setWhales);
    const i = setInterval(
      () => fetch("/api/whales").then((r) => r.json()).then(setWhales),
      120000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <div className="p-6">
      <Card title="Whale Tracker">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Large volume movements and whale activity based on market data
        </p>
        <div className="space-y-2">
          {whales.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <WhaleIcon type={w.type} />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {w.coin}{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      {w.type.replace("_", " ")}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(w.time).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-500">
                  {formatUSD(w.usdValue, true)}
                </p>
                <p className="text-xs text-zinc-500">
                  ~{w.amount.toFixed(2)} coins
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WhaleIcon({ type }: { type: string }) {
  const cls = "h-8 w-8 rounded-full p-2";
  if (type === "exchange_in")
    return (
      <div className={`${cls} bg-red-500/10 text-red-500`}>
        <ArrowDownToLine className="h-4 w-4" />
      </div>
    );
  if (type === "exchange_out")
    return (
      <div className={`${cls} bg-emerald-500/10 text-emerald-500`}>
        <ArrowUpFromLine className="h-4 w-4" />
      </div>
    );
  return (
    <div className={`${cls} bg-blue-500/10 text-blue-500`}>
      <ArrowRightLeft className="h-4 w-4" />
    </div>
  );
}
