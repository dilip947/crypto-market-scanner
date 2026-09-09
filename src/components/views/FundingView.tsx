"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FundingData {
  symbol: string;
  fundingRate: number;
  markPrice: number;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
}

export function FundingView() {
  const [data, setData] = useState<FundingData[]>([]);

  useEffect(() => {
    fetch("/api/funding")
      .then((r) => r.json())
      .then(setData);
    const i = setInterval(
      () => fetch("/api/funding").then((r) => r.json()).then(setData),
      60000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card title="Funding Rate Monitor">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Perpetual futures funding rates — positive = longs pay shorts
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-700">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Funding Rate</th>
                <th className="pb-2">Mark Price</th>
                <th className="pb-2">Long/Short Ratio</th>
                <th className="pb-2">Long %</th>
                <th className="pb-2">Short %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={d.symbol}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="py-3 font-medium">{d.symbol}</td>
                  <td
                    className={cn(
                      "py-3 font-semibold",
                      d.fundingRate > 0.01
                        ? "text-red-500"
                        : d.fundingRate < -0.01
                          ? "text-emerald-500"
                          : "text-zinc-500"
                    )}
                  >
                    {d.fundingRate.toFixed(4)}%
                  </td>
                  <td className="py-3">${d.markPrice.toLocaleString()}</td>
                  <td className="py-3">{d.longShortRatio.toFixed(2)}</td>
                  <td className="py-3 text-emerald-500">
                    {d.longAccount.toFixed(1)}%
                  </td>
                  <td className="py-3 text-red-500">
                    {d.shortAccount.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {data.slice(0, 6).map((d) => (
          <div
            key={d.symbol}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="font-semibold">{d.symbol} Long/Short</p>
            <div className="mt-2 flex h-4 overflow-hidden rounded-full">
              <div
                className="bg-emerald-500"
                style={{ width: `${d.longAccount}%` }}
              />
              <div
                className="bg-red-500"
                style={{ width: `${d.shortAccount}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-zinc-500">
              <span>Long {d.longAccount.toFixed(0)}%</span>
              <span>Short {d.shortAccount.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
