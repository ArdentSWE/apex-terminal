"use client";
import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface SMCPlay {
  ticker: string;
  type: string;
  dir: string;
  conf: number;
  entry: number;
  tp: number;
}

export default function SMCScanner() {
  const [plays, setPlays] = useState<SMCPlay[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM PYTHON BACKEND
  useEffect(() => {
    fetch('http://localhost:8000/api/smc')
      .then((res) => res.json())
      .then((data) => {
        setPlays(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch SMC data:", err));
  }, []);

  if (loading) return <div className="text-apex-cyan animate-pulse font-mono text-sm p-4">CONNECTING TO APEX ENGINE...</div>;

  return (
    <div className="flex flex-col h-full gap-3 overflow-y-auto pr-2 custom-scrollbar">
      {plays.map((play, i) => (
        <div key={i} className="bg-apex-bg border border-apex-border rounded p-3 flex flex-col gap-2 relative overflow-hidden group hover:border-apex-cyan/50 transition-colors cursor-pointer">
          <div className={`absolute top-0 left-0 w-1 h-full ${play.dir === 'CALLS' ? 'bg-apex-cyan' : 'bg-apex-red'}`} />
          
          <div className="flex justify-between items-center pl-2">
            <span className="font-bold font-mono text-lg">{play.ticker}</span>
            <span className={`text-xs font-mono px-2 py-1 rounded bg-opacity-20 ${play.dir === 'CALLS' ? 'text-apex-cyan bg-apex-cyan' : 'text-apex-red bg-apex-red'}`}>
              {play.type} {play.dir}
            </span>
          </div>

          <div className="flex justify-between text-xs text-apex-muted pl-2">
            <div className="flex flex-col">
              <span>Entry: <span className="text-white">${play.entry.toFixed(2)}</span></span>
              <span>Target: <span className="text-apex-green">${play.tp.toFixed(2)}</span></span>
            </div>
            <div className="flex flex-col items-end">
              <span>Edge: <span className="text-white">{play.conf}%</span></span>
              <div className="flex gap-[1px] mt-1">
                {[...Array(10)].map((_, j) => (
                  <div key={j} className={`h-1.5 w-2 ${j < Math.floor(play.conf / 10) ? 'bg-apex-green' : 'bg-apex-border'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-auto pt-4 border-t border-apex-border text-xs text-apex-muted flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-apex-gold shrink-0" />
        <p>Scanning 90-day Volume POC and Order Blocks across Top 50 Equities.</p>
      </div>
    </div>
  );
}