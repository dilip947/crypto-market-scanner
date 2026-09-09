import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const [sectorsRes, marketsRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/coins/categories?order=market_cap_change_24h_desc",
        { next: { revalidate: 300 } }
      ),
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=10&page=1",
        { next: { revalidate: 300 } }
      ),
    ]);

    const sectors = sectorsRes.ok ? await sectorsRes.json() : [];
    const topCoins = marketsRes.ok ? await marketsRes.json() : [];

    const narrativeMap: Record<string, { coins: string[]; desc: string }> = {
      "Artificial Intelligence (AI)": {
        coins: ["FET", "RNDR", "TAO", "NEAR"],
        desc: "AI tokens gaining traction with compute & agent narratives",
      },
      "Layer 1 (L1)": {
        coins: ["SOL", "AVAX", "SUI", "APT"],
        desc: "L1 chains competing on throughput and ecosystem growth",
      },
      DeFi: {
        coins: ["UNI", "AAVE", "MKR", "CRV"],
        desc: "DeFi protocols seeing TVL shifts and yield farming trends",
      },
      Meme: {
        coins: ["DOGE", "SHIB", "PEPE", "WIF"],
        desc: "Meme coins driven by social sentiment and retail flows",
      },
      "Real World Assets (RWA)": {
        coins: ["ONDO", "MKR", "CFG"],
        desc: "Tokenization of real-world assets gaining institutional interest",
      },
      Gaming: {
        coins: ["AXS", "IMX", "GALA", "SAND"],
        desc: "GameFi and metaverse tokens tracking gaming sector momentum",
      },
    };

    const narratives = sectors.slice(0, 12).map(
      (sector: {
        name: string;
        market_cap_change_24h: number;
        top_3_coins: string[];
      }) => {
        const mapped = narrativeMap[sector.name];
        const change = sector.market_cap_change_24h || 0;
        return {
          name: sector.name,
          strength: Math.min(100, Math.max(0, 50 + change * 2)),
          coins: mapped?.coins || sector.top_3_coins?.slice(0, 4) || [],
          trend:
            change > 2
              ? ("rising" as const)
              : change < -2
                ? ("falling" as const)
                : ("stable" as const),
          description:
            mapped?.desc ||
            `${sector.name} sector ${change >= 0 ? "outperforming" : "underperforming"} the market`,
        };
      }
    );

    if (topCoins.length > 0) {
      narratives.unshift({
        name: "Top Momentum",
        strength: 85,
        coins: topCoins.slice(0, 4).map((c: { symbol: string }) => c.symbol.toUpperCase()),
        trend: "rising" as const,
        description: "Highest 24h gainers driving short-term market narrative",
      });
    }

    return NextResponse.json(narratives.slice(0, 10));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch narratives", details: String(error) },
      { status: 500 }
    );
  }
}
