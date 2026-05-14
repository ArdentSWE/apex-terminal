"use client";
import React, { useEffect, useState } from 'react';
import { Newspaper, Droplet } from 'lucide-react';

interface TapePrint { ticker: string; size: string; premium: string; price: string; time: string; }
interface NewsItem { title: string; source: string; }

export function DarkPoolTape() {
  const [tape, setTape] = useState<TapePrint[]>([]);
  
  useEffect(() => {
    // 🚀 UPDATED: Pointing to the live Railway Cloud URL
    fetch('https://apex-engine-production.up.railway.app/api/tape?ticker=SPY')
      .then(res => res.json())
      .then(data => setTape(data.tape))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col h-full gap-2 overflow-y-auto pr-2 custom-scrollbar">
      {tape.map((print, i) => (
        <div key={i} className="bg-apex-bg border border-apex-border rounded p-2 text-xs font-mono flex flex-col gap-1 hover:border-apex-cyan/50 transition-colors cursor-crosshair">
          <div className="flex justify-between text-apex-muted">
            <span>{print.time}</span><Droplet className="w-3 h-3 text-apex-muted" />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-sm">{print.ticker}</span>
            <span className="text-apex-red font-bold">{print.premium}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MacroDocket({ ticker = "SPY" }: { ticker?: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 🚀 UPDATED: Pointing to the live Railway Cloud URL
    fetch(`https://apex-engine-production.up.railway.app/api/tape?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => {
        setNews(data.news);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [ticker]);

  if (loading) return <div className="text-apex-cyan animate-pulse font-mono text-xs p-2">SYNCING WIRE...</div>;

  return (
    <div className="flex flex-col h-full gap-3 overflow-y-auto pr-2 custom-scrollbar">
      {news.map((item, i) => (
        <div key={i} className="flex gap-2 items-start border-l-2 border-apex-border pl-2 hover:border-apex-gold transition-colors cursor-pointer">
          <Newspaper className="w-4 h-4 text-apex-muted shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight">{item.title}</span>
            <span className="text-xs text-apex-muted mt-1">{item.source}</span>
          </div>
        </div>
      ))}
    </div>
  );
}