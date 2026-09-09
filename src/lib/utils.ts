import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatUSD(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-emerald-500";
  if (value < 0) return "text-red-500";
  return "text-zinc-400";
}

export function getFearGreedColor(value: number): string {
  if (value <= 25) return "#ef4444";
  if (value <= 45) return "#f97316";
  if (value <= 55) return "#eab308";
  if (value <= 75) return "#84cc16";
  return "#22c55e";
}

export function symbolToTradingView(symbol: string): string {
  return `BINANCE:${symbol.toUpperCase()}USDT`;
}
