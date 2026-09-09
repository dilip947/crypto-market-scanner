import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=30", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch fear & greed");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fear & greed", details: String(error) },
      { status: 500 }
    );
  }
}
