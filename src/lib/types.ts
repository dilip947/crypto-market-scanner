export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
}

export interface GlobalMarket {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
  markets: number;
}

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

export interface Sector {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  top_3_coins: string[];
}

export interface FundingRate {
  symbol: string;
  fundingRate: number;
  nextFundingTime: number;
}

export interface LongShortRatio {
  symbol: string;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
}

export interface Liquidation {
  symbol: string;
  side: "LONG" | "SHORT";
  value: number;
  time: number;
}

export interface WhaleTransaction {
  coin: string;
  amount: number;
  usdValue: number;
  type: "transfer" | "exchange_in" | "exchange_out";
  time: string;
}

export interface ArbitrageOpportunity {
  coin: string;
  exchangeA: string;
  exchangeB: string;
  priceA: number;
  priceB: number;
  spreadPercent: number;
}

export interface CorrelatedPair {
  pair: string;
  correlation: number;
  trend: "strong" | "moderate" | "weak";
}

export interface CryptoFeedItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  time: string;
  likes?: number;
  url: string;
}

export interface Narrative {
  name: string;
  strength: number;
  coins: string[];
  trend: "rising" | "falling" | "stable";
  description: string;
}

export interface BingXBalance {
  asset: string;
  free: string;
  locked: string;
}

export type ViewId =
  | "dashboard"
  | "scanner"
  | "heatmap"
  | "coins"
  | "whales"
  | "funding"
  | "liquidations"
  | "narratives"
  | "social"
  | "correlation"
  | "arbitrage"
  | "calculator"
  | "wallet";
