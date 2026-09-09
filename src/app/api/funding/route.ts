import { NextResponse } from "next/server";

export const revalidate = 60;

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "DOTUSDT",
];

export async function GET() {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const [fundingRes, ratioRes] = await Promise.all([
          fetch(
            `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`
          ),
          fetch(
            `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1h&limit=1`
          ),
        ]);

        const funding = fundingRes.ok ? await fundingRes.json() : null;
        const ratio = ratioRes.ok ? await ratioRes.json() : [];

        return {
          symbol: symbol.replace("USDT", ""),
          fundingRate: funding
            ? parseFloat(funding.lastFundingRate) * 100
            : 0,
          markPrice: funding ? parseFloat(funding.markPrice) : 0,
          nextFundingTime: funding?.nextFundingTime || 0,
          longShortRatio: ratio[0]
            ? parseFloat(ratio[0].longShortRatio)
            : 1,
          longAccount: ratio[0]
            ? parseFloat(ratio[0].longAccount) * 100
            : 50,
          shortAccount: ratio[0]
            ? parseFloat(ratio[0].shortAccount) * 100
            : 50,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch funding data", details: String(error) },
      { status: 500 }
    );
  }
}
