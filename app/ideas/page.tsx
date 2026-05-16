"use client";
import React from 'react';
import useSWR from 'swr';
import { Lightbulb, Zap, Clock, ShieldAlert } from 'lucide-react';

const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app"; 

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TradeIdeasPage() {
  const { data: playsData, isLoading } = useSWR(`${ENGINE_URL}/api/equities/global_plays`, fetcher, { refreshInterval: 60000 });

  const plays = playsData?.plays || [];
  
  const dayTrades = plays.filter((p: any) => p.play_type === "DAY TRADE" || p.play_type === "0DTE SCALP" || p.play_type === "WEEKLY SWING");
  const swings = plays.filter((p: any) => p.play_type === "SWING");
  const leaps = plays.filter((p: any) => p.play_type === "LEAP" || p.play_type === "WHALE");

  const renderPlayCard = (play: any) => (
    <div key={play.ticker} className="flex flex-col p-5 bg-[#0f0c29]/60 border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all group">
      <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-3">
        <span className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">{play.ticker}</span>
        <div className={`px-3 py-1 text-xs font-bold font-mono rounded-md border ${play.direction === 'CALLS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
          {play.strike} {play.direction}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs p-3 bg-black/30 rounded-lg border border-white/5">
        <div className="flex flex-col"><span className="text-gray-500 mb-1">EDGE</span><span className="text-indigo-300 font-bold">{play.confidence}%</span></div>
        <div className="flex flex-col"><span className="text-gray-500 mb-1">EXPIRY</span><span className="text-white">{play.expiration}</span></div>
        <div className="flex flex-col mt-2"><span className="text-gray-500 mb-1">ENTRY</span><span className="text-white">{play.entry_price || "Market"}</span></div>
        <div className="flex flex-col mt-2"><span className="text-gray-500 mb-1">SL</span><span className="text-rose-400">{play.sl || "Trend Loss"}</span></div>
      </div>
      
      <div className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-4 mt-auto">
        <span className="text-indigo-400/80 font-mono mr-2">THESIS:</span>
        {play.thesis.replace(/\*\*/g, '')}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#02010a] text-white font-sans overflow-hidden">
      
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-900/10 blur-[150px] rounded-full pointer-events-none z-0" />

        <header className="h-16 border-b border-white/5 bg-white/[0.01] backdrop-blur-md flex items-center px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <h2 className="font-mono text-sm tracking-widest text-white font-bold">ALGORITHMIC TRADE IDEAS</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10">
          
          {/* DAY TRADES */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="font-mono text-lg font-bold tracking-widest">DAY TRADES / 0DTE</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? <div className="col-span-full text-indigo-500/50 font-mono text-sm animate-pulse p-4">COMPILING ALGORITHMS...</div> : 
               dayTrades.length === 0 ? <p className="col-span-full text-gray-500 font-mono text-sm p-4">MARKET FLAT. NO SETUPS ACTIVE.</p> :
               dayTrades.map(renderPlayCard)}
            </div>
          </section>

          {/* SWING TRADES */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h3 className="font-mono text-lg font-bold tracking-widest">SWING HORIZON (1-3 MO)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? <div className="col-span-full text-indigo-500/50 font-mono text-sm animate-pulse p-4">CALCULATING ORDER BLOCKS...</div> : 
               swings.length === 0 ? <p className="col-span-full text-gray-500 font-mono text-sm p-4">MARKET FLAT. NO SETUPS ACTIVE.</p> :
               swings.map(renderPlayCard)}
            </div>
          </section>

          {/* LEAPS */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-violet-400" />
              <h3 className="font-mono text-lg font-bold tracking-widest">INSTITUTIONAL LEAPS (6+ MO)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? <div className="col-span-full text-indigo-500/50 font-mono text-sm animate-pulse p-4">HUNTING DARK POOLS...</div> : 
               leaps.length === 0 ? <p className="col-span-full text-gray-500 font-mono text-sm p-4">MARKET FLAT. NO SETUPS ACTIVE.</p> :
               leaps.map(renderPlayCard)}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}