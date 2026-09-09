import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const [marketsRes, globalRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d,30d",
        { next: { revalidate: 60 } }
      ),
      fetch("https://api.coingecko.com/api/v3/global", {
        next: { revalidate: 60 },
      }),
    ]);

    if (!marketsRes.ok || !globalRes.ok) {
      throw new Error("Failed to fetch market data");
    }

    const markets = await marketsRes.json();
    const globalData = await globalRes.json();

    return NextResponse.json({
      markets,
      global: globalData.data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch markets", details: String(error) },
      { status: 500 }
    );
  }
}
