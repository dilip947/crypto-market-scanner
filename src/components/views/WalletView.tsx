"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Wallet, Eye, EyeOff, RefreshCw } from "lucide-react";
import type { BingXBalance } from "@/lib/types";

export function WalletView() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [balances, setBalances] = useState<BingXBalance[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("bingx_api_key");
    const savedSecret = localStorage.getItem("bingx_api_secret");
    if (savedKey && savedSecret) {
      setApiKey(savedKey);
      setApiSecret(savedSecret);
      connect(savedKey, savedSecret);
    }
  }, []);

  async function connect(key?: string, secret?: string) {
    const k = key || apiKey;
    const s = secret || apiSecret;
    if (!k || !s) {
      setError("Please enter API key and secret");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bingx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: k, apiSecret: s }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Connection failed");
        setConnected(false);
        return;
      }

      setBalances(data.balances || []);
      setConnected(true);
      localStorage.setItem("bingx_api_key", k);
      localStorage.setItem("bingx_api_secret", s);
    } catch {
      setError("Failed to connect to BingX");
    }
    setLoading(false);
  }

  function disconnect() {
    localStorage.removeItem("bingx_api_key");
    localStorage.removeItem("bingx_api_secret");
    setApiKey("");
    setApiSecret("");
    setBalances([]);
    setConnected(false);
  }

  return (
    <div className="p-6">
      <Card title="BingX Wallet">
        <p className="-mt-2 mb-4 text-xs text-zinc-500">
          Connect your BingX API keys to view balances. Keys are stored locally
          in your browser only.
        </p>

        {!connected ? (
          <div className="max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field"
                placeholder="Your BingX API Key"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                API Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Your BingX API Secret"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-2.5 text-zinc-400"
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={() => connect()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Connected to BingX
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => connect()}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={disconnect}
                  className="rounded-lg px-3 py-1 text-sm text-red-500 hover:bg-red-500/10"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {balances.length === 0 ? (
              <p className="text-zinc-500">No balances found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-700">
                      <th className="pb-2">Asset</th>
                      <th className="pb-2">Available</th>
                      <th className="pb-2">Locked</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balances.map((b) => {
                      const total =
                        parseFloat(b.free) + parseFloat(b.locked);
                      return (
                        <tr
                          key={b.asset}
                          className="border-b border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="py-3 font-medium">{b.asset}</td>
                          <td className="py-3">{parseFloat(b.free).toFixed(6)}</td>
                          <td className="py-3">
                            {parseFloat(b.locked).toFixed(6)}
                          </td>
                          <td className="py-3 font-semibold">
                            {total.toFixed(6)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
