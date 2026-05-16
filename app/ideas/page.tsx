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
    <div key={play.ticker} className="flex flex-col p-5 bg-[#14002e]/40 border border-purple-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-fuchsia-500/50 hover:bg-purple-900/10 transition-all group">
      <div className="flex justify-between items-start mb-3 border-b border-purple-500/10 pb-3">
        <span className="text-2xl font-black text-white group-hover:text-fuchsia-400 transition-colors tracking-wider">{play.ticker}</span>
        <div className={`px-3 py-1 text-xs font-bold font-mono rounded-md border ${play.direction === 'CALLS' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
          {play.strike} {play.direction}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs p-3 bg-black/40 rounded-lg border border-purple-500/10">
        <div className="flex flex-col"><span className="text-purple-400/60 mb-1 text-[10px]">EDGE</span><span className="text-fuchsia-400 font-bold drop-shadow-[0_0_5px_rgba(217,70,239,0.4)]">{play.confidence}%</span></div>
        <div className="flex flex-col"><span className="text-purple-400/60 mb-1 text-[10px]">EXPIRY</span><span className="text-white">{play.expiration}</span></div>
        <div className="flex flex-col mt-2"><span className="text-purple-400/60 mb-1 text-[10px]">ENTRY</span><span className="text-white">{play.entry_price || "Market"}</span></div>
        <div className="flex flex-col mt-2"><span className="text-purple-400/60 mb-1 text-[10px]">SL</span><span className="text-rose-400">{play.sl || "Trend Loss"}</span></div>
      </div>
      
      <div className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-4 mt-auto">
        <span className="text-fuchsia-400/80 font-mono mr-2">THESIS:</span>
        {play.thesis.replace(/\*\*/g, '')}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#090014] text-white font-sans overflow-hidden">
      
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* PHILIPS HUE GLOWS */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-900/10 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none z-0" />

        <header className="h-16 border-b border-purple-500/10 bg-[#090014]/50 backdrop-blur-md flex items-center px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-fuchsia-500" />
            <h2 className="font-mono text-sm tracking-widest text-purple-200 font-bold">ALGORITHMIC TRADE IDEAS</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10">
          
          {/* DAY TRADES */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4 border-b border-purple-500/10 pb-2">
              <Zap className="w-5 h-5 text-fuchsia-400" />
              <h3 className="font-mono text-lg font-bold tracking-widest text-white">DAY TRADES / 0DTE</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? <div className="col-span-full text-fuchsia-500/50 font-mono text-sm animate-pulse p-4">COMPILING ALGORITHMS...</div> : 
               dayTrades.length === 0 ? <p className="col-span-full text-purple-500/50 font-mono text-sm p-4">MARKET FLAT. NO SETUPS ACTIVE.</p> :
               dayTrades.map(renderPlayCard)}
            </div>
          </section>

          {/* SWING TRADES */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4 border-b border-purple-500/10 pb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="font-mono text-lg font-bold tracking-widest text-white">SWING HORIZON (1-3 MO)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? <div className="col-span-full text-fuchsia-500/50 font-mono text-sm animate-pulse p-4">CALCULATING ORDER BLOCKS...</div> : 
               swings.length === 0 ? <p className="col-span-full text-purple-500/50 font-mono text-sm p-4">MARKET FLAT. NO SETUPS ACTIVE.</p> :
               swings.map(renderPlayCard)}
            </div>
          </section>

          {/* LEAPS */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4 border-b border-purple-500/10 pb-2">
              <ShieldAlert className="w-5 h-5 text-fuchsia-500" />
              <h3 className="font-mono text-lg font-bold tracking-widest text-white">INSTITUTIONAL LEAPS (6+ MO)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? <div className="col-span-full text-fuchsia-500/50 font-mono text-sm animate-pulse p-4">HUNTING DARK POOLS...</div> : 
               leaps.length === 0 ? <p className="col-span-full text-purple-500/50 font-mono text-sm p-4">MARKET FLAT. NO SETUPS ACTIVE.</p> :
               leaps.map(renderPlayCard)}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}