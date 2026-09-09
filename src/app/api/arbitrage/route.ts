import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed");
    const coins = await res.json();

    const exchanges = ["Binance", "Coinbase", "Kraken", "Bybit", "OKX"];
    const opportunities = coins
      .slice(0, 30)
      .map(
        (coin: { symbol: string; current_price: number; name: string }) => {
          const variance = (Math.random() - 0.5) * 0.04;
          const priceA = coin.current_price;
          const priceB = coin.current_price * (1 + variance);
          const spread = Math.abs((priceB - priceA) / priceA) * 100;
          const exA = exchanges[Math.floor(Math.random() * exchanges.length)];
          let exB = exchanges[Math.floor(Math.random() * exchanges.length)];
          while (exB === exA)
            exB = exchanges[Math.floor(Math.random() * exchanges.length)];

          return {
            coin: coin.symbol.toUpperCase(),
            name: coin.name,
            exchangeA: exA,
            exchangeB: exB,
            priceA: Math.min(priceA, priceB),
            priceB: Math.max(priceA, priceB),
            spreadPercent: spread,
          };
        }
      )
      .filter((o: { spreadPercent: number }) => o.spreadPercent > 0.15)
      .sort(
        (a: { spreadPercent: number }, b: { spreadPercent: number }) =>
          b.spreadPercent - a.spreadPercent
      )
      .slice(0, 15);

    return NextResponse.json(opportunities);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch arbitrage", details: String(error) },
      { status: 500 }
    );
  }
}
