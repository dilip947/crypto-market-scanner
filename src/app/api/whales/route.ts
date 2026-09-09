import { NextResponse } from "next/server";

export const revalidate = 120;

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=20&page=1",
      { next: { revalidate: 120 } }
    );
    if (!res.ok) throw new Error("Failed");
    const coins = await res.json();

    const whales = coins.flatMap(
      (coin: {
        symbol: string;
        name: string;
        total_volume: number;
        price_change_percentage_24h: number;
      }) => {
        const baseVolume = coin.total_volume * 0.05;
        return [
          {
            coin: coin.symbol.toUpperCase(),
            name: coin.name,
            amount: baseVolume / 50000,
            usdValue: baseVolume,
            type: "transfer" as const,
            time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          },
          {
            coin: coin.symbol.toUpperCase(),
            name: coin.name,
            amount: baseVolume * 0.3 / 50000,
            usdValue: baseVolume * 0.3,
            type:
              coin.price_change_percentage_24h > 0
                ? ("exchange_out" as const)
                : ("exchange_in" as const),
            time: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          },
        ];
      }
    );

    whales.sort(
      (a: { usdValue: number }, b: { usdValue: number }) =>
        b.usdValue - a.usdValue
    );

    return NextResponse.json(whales.slice(0, 25));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch whale data", details: String(error) },
      { status: 500 }
    );
  }
}
