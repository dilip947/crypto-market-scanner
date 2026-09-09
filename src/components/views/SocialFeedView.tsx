"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { CryptoFeedItem } from "@/lib/types";
import { ExternalLink, Heart } from "lucide-react";

interface SocialData {
  accounts: Array<{
    author: string;
    handle: string;
    avatar: string;
    url: string;
  }>;
  feed: CryptoFeedItem[];
}

export function SocialFeedView() {
  const [data, setData] = useState<SocialData>({ accounts: [], feed: [] });

  useEffect(() => {
    fetch("/api/social")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-3">
      <Card title="Key Crypto Accounts" className="lg:col-span-1">
        <p className="-mt-2 mb-3 text-xs text-zinc-500">
          Follow these X.com accounts for market insights
        </p>
        <div className="space-y-2">
          {data.accounts.map((a) => (
            <a
              key={a.handle}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600">
                {a.avatar}
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {a.author}
                </p>
                <p className="text-xs text-zinc-500">{a.handle}</p>
              </div>
              <ExternalLink className="ml-auto h-4 w-4 text-zinc-400" />
            </a>
          ))}
        </div>
      </Card>

      <Card title="Crypto Feed" className="lg:col-span-2">
        <p className="-mt-2 mb-3 text-xs text-zinc-500">
          Latest news and insights from top crypto sources
        </p>
        <div className="space-y-4">
          {data.feed.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-zinc-100 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold dark:bg-zinc-800">
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {item.author}
                    </span>
                    <span className="text-xs text-zinc-500">{item.handle}</span>
                    <span className="text-xs text-zinc-400">
                      · {new Date(item.time).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {item.content}
                  </p>
                  {item.likes && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-zinc-400">
                      <Heart className="h-3 w-3" /> {item.likes.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
