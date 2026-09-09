"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatUSD, formatPercent } from "@/lib/utils";

export function CalculatorPanel() {
  const { calculatorOpen, setCalculatorOpen } = useApp();
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState("1");

  if (!calculatorOpen) return null;

  const buy = parseFloat(buyPrice) || 0;
  const sell = parseFloat(sellPrice) || 0;
  const qty = parseFloat(quantity) || 0;
  const lev = parseFloat(leverage) || 1;

  const investment = buy * qty;
  const proceeds = sell * qty;
  const pnl = (proceeds - investment) * lev;
  const pnlPercent = investment > 0 ? ((proceeds - investment) / investment) * 100 * lev : 0;

  return (
    <div className="fixed right-4 top-20 z-50 w-80 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          P/L Calculator
        </h3>
        <button
          onClick={() => setCalculatorOpen(false)}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Field label="Buy Price ($)" value={buyPrice} onChange={setBuyPrice} />
        <Field label="Sell Price ($)" value={sellPrice} onChange={setSellPrice} />
        <Field label="Quantity" value={quantity} onChange={setQuantity} />
        <Field label="Leverage (x)" value={leverage} onChange={setLeverage} />

        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Investment</span>
            <span className="font-medium">{formatUSD(investment)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-zinc-500">Proceeds</span>
            <span className="font-medium">{formatUSD(proceeds)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <span className="font-medium">Profit / Loss</span>
            <span
              className={`font-bold ${pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              {formatUSD(pnl)} ({formatPercent(pnlPercent)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        placeholder="0.00"
      />
    </div>
  );
}
