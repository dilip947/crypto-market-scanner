import { NextResponse } from "next/server";
import crypto from "crypto";

function sign(queryString: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(queryString).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { apiKey, apiSecret } = await request.json();

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "API key and secret are required" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = sign(queryString, apiSecret);

    const res = await fetch(
      `https://open-api.bingx.com/openApi/spot/v1/account/balance?${queryString}&signature=${signature}`,
      {
        headers: {
          "X-BX-APIKEY": apiKey,
        },
      }
    );

    const data = await res.json();

    if (data.code !== 0 && !data.data) {
      return NextResponse.json(
        { error: data.msg || "Failed to fetch BingX balance", code: data.code },
        { status: 400 }
      );
    }

    const balances = (data.data?.balances || [])
      .filter(
        (b: { free: string; locked: string }) =>
          parseFloat(b.free) > 0 || parseFloat(b.locked) > 0
      )
      .map(
        (b: { asset: string; free: string; locked: string }) => ({
          asset: b.asset,
          free: b.free,
          locked: b.locked,
        })
      );

    return NextResponse.json({ balances, connected: true });
  } catch (error) {
    return NextResponse.json(
      { error: "BingX connection failed", details: String(error) },
      { status: 500 }
    );
  }
}
