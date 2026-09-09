import { NextResponse } from "next/server";

export const revalidate = 30;

export async function GET() {
  try {
    const res = await fetch(
      "https://fapi.binance.com/fapi/v1/allForceOrders?limit=50",
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      const tickers = await fetch(
        "https://fapi.binance.com/fapi/v1/ticker/24hr"
      );
      const data = tickers.ok ? await tickers.json() : [];
      const top = data
        .filter((t: { symbol: string }) => t.symbol.endsWith("USDT"))
        .sort(
          (a: { quoteVolume: string }, b: { quoteVolume: string }) =>
            parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
        )
        .slice(0, 15)
        .map(
          (t: {
            symbol: string;
            priceChangePercent: string;
            quoteVolume: string;
          }) => ({
            symbol: t.symbol.replace("USDT", ""),
            side: parseFloat(t.priceChangePercent) < 0 ? "LONG" : "SHORT",
            value: parseFloat(t.quoteVolume) * 0.001,
            time: Date.now(),
          })
        );
      return NextResponse.json(top);
    }

    const orders = await res.json();
    const liquidations = orders.slice(0, 30).map(
      (o: {
        symbol: string;
        side: string;
        price: string;
        origQty: string;
        time: number;
      }) => ({
        symbol: o.symbol.replace("USDT", ""),
        side: o.side === "SELL" ? "LONG" : "SHORT",
        value: parseFloat(o.price) * parseFloat(o.origQty),
        time: o.time,
      })
    );

    return NextResponse.json(liquidations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch liquidations", details: String(error) },
      { status: 500 }
    );
  }
}
