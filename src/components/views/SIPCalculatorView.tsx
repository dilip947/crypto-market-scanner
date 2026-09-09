"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { formatUSD, formatPercent } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COIN_OPTIONS = [
  { id: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", label: "Ethereum (ETH)" },
  { id: "solana", label: "Solana (SOL)" },
  { id: "binancecoin", label: "BNB" },
  { id: "ripple", label: "XRP" },
  { id: "cardano", label: "Cardano (ADA)" },
];

export function SIPCalculatorView() {
  const [coinId, setCoinId] = useState("bitcoin");
  const [monthlyAmount, setMonthlyAmount] = useState("100");
  const [years, setYears] = useState("5");
  const [historicalYears, setHistoricalYears] = useState("5");
  const [result, setResult] = useState<{
    totalInvested: number;
    currentValue: number;
    profit: number;
    profitPercent: number;
    chart: Array<{ month: string; value: number; invested: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculate();
  }, [coinId, monthlyAmount, years, historicalYears]);

  async function calculate() {
    setLoading(true);
    const monthly = parseFloat(monthlyAmount) || 0;
    const numYears = parseInt(years) || 1;
    const histYears = parseInt(historicalYears) || 5;
    const days = histYears * 365;

    try {
      const res = await fetch(
        `/api/historical?coinId=${coinId}&days=${days}`
      );
      const data = await res.json();
      const prices: [number, number][] = data.prices || [];

      if (prices.length === 0) {
        setResult(null);
        setLoading(false);
        return;
      }

      const monthsToSimulate = Math.min(numYears * 12, Math.floor(prices.length / 30));
      const startIdx = Math.max(0, prices.length - monthsToSimulate * 30);

      let totalCoins = 0;
      let totalInvested = 0;
      const chart: Array<{ month: string; value: number; invested: number }> =
        [];

      for (let m = 0; m < monthsToSimulate; m++) {
        const priceIdx = startIdx + m * 30;
        if (priceIdx >= prices.length) break;
        const price = prices[priceIdx][1];
        totalCoins += monthly / price;
        totalInvested += monthly;
        const currentPrice = prices[prices.length - 1][1];
        const value = totalCoins * currentPrice;

        chart.push({
          month: `M${m + 1}`,
          value: Math.round(value),
          invested: Math.round(totalInvested),
        });
      }

      const currentPrice = prices[prices.length - 1][1];
      const currentValue = totalCoins * currentPrice;
      const profit = currentValue - totalInvested;
      const profitPercent =
        totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

      setResult({
        totalInvested,
        currentValue,
        profit,
        profitPercent,
        chart,
      });
    } catch {
      setResult(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 p-6">
      <Card title="SIP / DCA Calculator">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Simulate monthly systematic investment — see how your portfolio would
          have grown
        </p>

        <div className="grid gap-4 lg:grid-cols-4">
          <Field label="Coin">
            <select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              className="input-field"
            >
              {COIN_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Monthly Investment ($)">
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Investment Period (years)">
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Lookback Period (years)">
            <input
              type="number"
              value={historicalYears}
              onChange={(e) => setHistoricalYears(e.target.value)}
              className="input-field"
            />
          </Field>
        </div>

        {loading && (
          <p className="mt-4 text-zinc-500">Calculating...</p>
        )}

        {result && !loading && (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <ResultBox
                label="Total Invested"
                value={formatUSD(result.totalInvested)}
              />
              <ResultBox
                label="Current Value"
                value={formatUSD(result.currentValue)}
              />
              <ResultBox
                label="Profit / Loss"
                value={formatUSD(result.profit)}
                positive={result.profit >= 0}
              />
              <ResultBox
                label="Return"
                value={formatPercent(result.profitPercent)}
                positive={result.profit >= 0}
              />
            </div>

            {result.chart.length > 0 && (
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chart}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(v) => formatUSD(Number(v) || 0)}
                    />
                    <Line
                      type="monotone"
                      dataKey="invested"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      name="Invested"
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Portfolio Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

function ResultBox({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${
          positive === undefined
            ? "text-zinc-900 dark:text-white"
            : positive
              ? "text-emerald-500"
              : "text-red-500"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
