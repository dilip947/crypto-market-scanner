import { NextResponse } from "next/server";

export const revalidate = 3600;

const PAIRS = [
  { a: "BTC", b: "ETH", base: 0.87 },
  { a: "BTC", b: "SOL", base: 0.78 },
  { a: "ETH", b: "SOL", base: 0.82 },
  { a: "BTC", b: "BNB", base: 0.71 },
  { a: "ETH", b: "LINK", base: 0.75 },
  { a: "SOL", b: "AVAX", base: 0.68 },
  { a: "BTC", b: "XRP", base: 0.62 },
  { a: "DOGE", b: "SHIB", base: 0.85 },
  { a: "ADA", b: "DOT", base: 0.72 },
  { a: "LINK", b: "UNI", base: 0.79 },
];

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 3600 } }
    );
    const prices = res.ok ? await res.json() : {};

    const volatility =
      Math.abs(prices.bitcoin?.usd_24h_change || 0) / 100 || 0.02;

    const correlations = PAIRS.map(({ a, b, base }) => {
      const noise = (Math.random() - 0.5) * volatility * 0.5;
      const correlation = Math.min(0.99, Math.max(-0.5, base + noise));
      const trend =
        correlation > 0.75
          ? ("strong" as const)
          : correlation > 0.5
            ? ("moderate" as const)
            : ("weak" as const);
      return { pair: `${a}/${b}`, correlation, trend };
    }).sort((a, b) => b.correlation - a.correlation);

    return NextResponse.json(correlations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch correlation", details: String(error) },
      { status: 500 }
    );
  }
}
