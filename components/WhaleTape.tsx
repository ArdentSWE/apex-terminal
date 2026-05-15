'use client';
import { useEffect, useState } from 'react';

export default function WhaleTape() {
  const [whales, setWhales] = useState<any[]>([]);
  // Hardcoded fallback to guarantee connection
  const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app";

  useEffect(() => {
    fetch(`${ENGINE_URL}/api/flow/whales`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tape && data.tape.length > 0) {
          setWhales(data.tape);
        }
      })
      .catch((err) => console.error("Whale tape error:", err));
  }, []);

  // Show a pulsing scanner when the market is closed or no whales are detected
  if (whales.length === 0) {
    return (
      <div className="w-full bg-black border-y border-[#333] overflow-hidden relative flex items-center justify-center h-12 shrink-0">
         <span className="text-cyan-500 font-mono text-xs tracking-widest animate-pulse">SCANNING DARK POOLS FOR WHALE FLOW...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black border-y border-[#333] overflow-hidden relative flex items-center h-12 shrink-0">
      <div className="absolute whitespace-nowrap animate-marquee flex space-x-8">
        {whales.map((whale, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm font-mono">
            <span className="text-gray-500">{whale.time}</span>
            <span className="text-white font-bold">{whale.ticker}</span>
            <span className={whale.ctype === 'CALL' ? 'text-cyan-400' : 'text-fuchsia-500'}>
              {whale.ctype}
            </span>
            <span className="text-green-400">{whale.premium}</span>
            <span className="text-gray-400">Strike: {whale.strike}</span>
            <span className="text-[#333] px-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}