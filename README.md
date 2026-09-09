# CryptoScan — Crypto Market Intelligence Hub

A comprehensive crypto market scanner and dashboard built with Next.js. Monitor market conditions, sector strength, pumping/dumping coins, fear & greed index, whale activity, funding rates, liquidations, narratives, and more — all in one place.

## Features

- **Market Dashboard** — Total market cap, volume, BTC dominance, fear & greed index, top gainers/losers
- **Market Scanner** — Strong/weak sectors, pumping and dumping coins
- **Crypto Heat Map** — Visual treemap by market cap and 24h change
- **Coin Charts** — Full TradingView charts with drawing tools for 100+ coins
- **Whale Tracker** — Large volume movements and whale activity
- **Funding Monitor** — Perpetual futures funding rates and long/short ratios
- **Liquidations** — Recent long and short liquidations
- **Narratives** — Trending sector narratives and themes
- **Crypto X Feed** — Key crypto accounts and news feed
- **Correlated Pairs** — Price correlation between major pairs
- **Arbitrage Scanner** — Cross-exchange price differences
- **SIP Calculator** — Simulate monthly DCA investments with historical data
- **BingX Wallet** — Connect your BingX API to view balances
- **P/L Calculator** — Floating profit/loss calculator (top right)
- **Light/Dark Mode** — Theme toggle (top right)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## BingX Wallet Setup

1. Go to BingX → API Management
2. Create an API key with **Read** permissions only
3. Open **BingX Wallet** in the sidebar
4. Enter your API key and secret (stored locally in your browser)

## Deploy

### Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### GitHub Pages / Static

This app uses Next.js API routes, so it requires a Node.js host (Vercel, Railway, Render, etc.).

## Data Sources

- [CoinGecko](https://coingecko.com) — Market data, sectors, historical prices
- [Alternative.me](https://alternative.me) — Fear & Greed Index
- [Binance Futures](https://binance.com) — Funding rates, long/short ratio, liquidations
- [TradingView](https://tradingview.com) — Chart widgets
- [Cointelegraph RSS](https://cointelegraph.com) — Crypto news feed

## Tech Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4
- Recharts · Lucide Icons
- TradingView Advanced Chart Widget
