import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/categories?order=market_cap_desc",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("Failed to fetch sectors");
    const categories = await res.json();
    const sectors = categories.slice(0, 20).map(
      (cat: {
        id: string;
        name: string;
        market_cap: number;
        market_cap_change_24h: number;
        top_3_coins: string[];
      }) => ({
        id: cat.id,
        name: cat.name,
        market_cap: cat.market_cap,
        market_cap_change_24h: cat.market_cap_change_24h,
        top_3_coins: cat.top_3_coins || [],
      })
    );
    return NextResponse.json(sectors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sectors", details: String(error) },
      { status: 500 }
    );
  }
}
