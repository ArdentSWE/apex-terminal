'use client';
import { useEffect, useState } from 'react';

export default function WhaleTape() {
  const [whales, setWhales] = useState<any[]>([]);

  useEffect(() => {
    // Replace with your actual Railway backend URL
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flow/whales`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tape) setWhales(data.tape);
      })
      .catch((err) => console.error("Whale tape error:", err));
  }, []);

  if (whales.length === 0) return null;

  return (
    <div className="w-full bg-black border-y border-neutral-800 overflow-hidden relative flex items-center h-12">
      <div className="absolute whitespace-nowrap animate-marquee flex space-x-8">
        {whales.map((whale, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm font-mono">
            <span className="text-neutral-500">{whale.time}</span>
            <span className="text-white font-bold">{whale.ticker}</span>
            <span className={whale.ctype === 'CALL' ? 'text-cyan-400' : 'text-fuchsia-500'}>
              {whale.ctype}
            </span>
            <span className="text-green-400">{whale.premium}</span>
            <span className="text-neutral-400">Strike: {whale.strike}</span>
            <span className="text-neutral-600 px-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}