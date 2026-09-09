import { NextResponse } from "next/server";

export const revalidate = 600;

const CRYPTO_ACCOUNTS = [
  {
    author: "CZ 🔶 BNB",
    handle: "@cz_binance",
    avatar: "CZ",
    url: "https://x.com/cz_binance",
  },
  {
    author: "Vitalik Buterin",
    handle: "@VitalikButerin",
    avatar: "VB",
    url: "https://x.com/VitalikButerin",
  },
  {
    author: "CoinDesk",
    handle: "@CoinDesk",
    avatar: "CD",
    url: "https://x.com/CoinDesk",
  },
  {
    author: "Wu Blockchain",
    handle: "@WuBlockchain",
    avatar: "WB",
    url: "https://x.com/WuBlockchain",
  },
  {
    author: "Lookonchain",
    handle: "@lookonchain",
    avatar: "LC",
    url: "https://x.com/lookonchain",
  },
  {
    author: "CryptoQuant",
    handle: "@cryptoquant_com",
    avatar: "CQ",
    url: "https://x.com/cryptoquant_com",
  },
];

const SAMPLE_INSIGHTS = [
  "Bitcoin ETF inflows remain strong — institutional demand continues to support price.",
  "Ethereum L2 activity hits new ATH as gas fees drop significantly on rollups.",
  "Whale wallets accumulating SOL — on-chain data shows large transfers to cold storage.",
  "Funding rates turning negative on altcoins — potential short squeeze setup forming.",
  "DeFi TVL climbing for 3rd consecutive week, led by lending protocols.",
  "Meme coin sector rotation: traders moving from DOGE to newer Solana memes.",
  "Macro watch: Fed rate decision next week could impact crypto risk appetite.",
  "Stablecoin market cap at all-time high — dry powder ready for deployment.",
];

export async function GET() {
  try {
    let newsItems: Array<{ title: string; link: string; pubDate: string }> = [];
    try {
      const res = await fetch("https://cointelegraph.com/rss", {
        next: { revalidate: 600 },
      });
      if (res.ok) {
        const text = await res.text();
        const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(
          0,
          8
        );
        newsItems = items.map((match) => {
          const item = match[1];
          const title =
            item.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] ||
            item.match(/<title>(.*?)<\/title>/)?.[1] ||
            "Crypto News";
          const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
          const pubDate =
            item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ||
            new Date().toISOString();
          return { title, link, pubDate };
        });
      }
    } catch {
      /* fallback below */
    }

    const feed = CRYPTO_ACCOUNTS.flatMap((account, i) => {
      const news = newsItems[i];
      const insight = SAMPLE_INSIGHTS[i % SAMPLE_INSIGHTS.length];
      return [
        {
          id: `${account.handle}-news`,
          author: account.author,
          handle: account.handle,
          avatar: account.avatar,
          content: news?.title || insight,
          time: news?.pubDate || new Date(Date.now() - i * 3600000).toISOString(),
          url: news?.link || account.url,
          likes: Math.floor(Math.random() * 5000) + 500,
        },
      ];
    });

    return NextResponse.json({ accounts: CRYPTO_ACCOUNTS, feed });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch social feed", details: String(error) },
      { status: 500 }
    );
  }
}
