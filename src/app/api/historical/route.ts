import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId") || "bitcoin";
  const days = searchParams.get("days") || "365";

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Failed to fetch historical data");
    const data = await res.json();

    const prices: [number, number][] = data.prices || [];
    const monthly: Record<string, number> = {};

    prices.forEach(([timestamp, price]) => {
      const date = new Date(timestamp);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = price;
    });

    return NextResponse.json({ prices, monthly });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch historical data", details: String(error) },
      { status: 500 }
    );
  }
}
