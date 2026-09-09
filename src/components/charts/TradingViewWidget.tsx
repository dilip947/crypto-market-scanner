"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { symbolToTradingView } from "@/lib/utils";

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
}

export function TradingViewWidget({
  symbol,
  height = 500,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbolToTradingView(symbol),
      interval: "60",
      timezone: "Etc/UTC",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ["Volume@tv-basicstudies"],
    });

    containerRef.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div
      className="tradingview-widget-container rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
