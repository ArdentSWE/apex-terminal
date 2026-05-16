"use client";
import React from 'react';
import useSWR from 'swr';
import { Trophy, Zap } from 'lucide-react';

const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app"; 
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SportsTicker() {
  // Refreshes ESPN data every 15 seconds
  const { data, isLoading } = useSWR(`${ENGINE_URL}/api/sports/ticker`, fetcher, { refreshInterval: 15000 });

  const games = data?.games || [];
  const parlay = data?.parlay || "SCANNING MARKETS...";

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-[#090014]/95 backdrop-blur-xl border-t border-fuchsia-500/20 shadow-[0_-5px_20px_rgba(217,70,239,0.05)] z-[100] flex items-center overflow-hidden shrink-0">
      
      {/* STATIC LEFT BADGE */}
      <div className="h-full bg-fuchsia-600 border-r border-fuchsia-400 flex items-center px-4 shadow-[5px_0_15px_rgba(217,70,239,0.3)] z-10 shrink-0">
        <Trophy className="w-4 h-4 text-white mr-2" />
        <span className="font-mono text-[10px] font-black tracking-widest text-white uppercase">
          SPORTS DESK
        </span>
      </div>

      {/* SCROLLING TICKER TAPE */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        {isLoading ? (
          <div className="text-fuchsia-500/50 font-mono text-xs tracking-widest pl-4 animate-pulse">
            SYNCING WITH ESPN SATELLITES...
          </div>
        ) : (
          <div className="whitespace-nowrap animate-marquee flex items-center space-x-8 pl-4">
            
            {/* The God Parlay Injection */}
            <div className="flex items-center space-x-2 text-xs font-mono bg-purple-900/30 px-3 py-1 rounded border border-purple-500/30">
              <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-white font-bold tracking-wider">{parlay}</span>
            </div>

            <span className="text-fuchsia-500/30 px-2">|</span>

            {/* Live ESPN Scores */}
            {games.map((game: string, idx: number) => {
              // Extract the status (e.g. [3Q 04:12]) and the score to color code it
              const isLive = game.includes('Q') || game.includes('Half');
              return (
                <div key={idx} className="flex items-center space-x-2 text-xs font-mono tracking-wider">
                  <span className={`${isLive ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-purple-300/60'}`}>
                    {game.split(']')[0] + ']'}
                  </span>
                  <span className="text-purple-100 font-bold">{game.split(']')[1]}</span>
                  <span className="text-fuchsia-500/30 px-4">|</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}