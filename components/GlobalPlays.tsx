'use client';
import { useEffect, useState } from 'react';

export default function GlobalPlays() {
  const [plays, setPlays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/equities/global_plays`)
      .then((res) => res.json())
      .then((data) => {
        if (data.plays) setPlays(data.plays);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-neutral-500 font-mono animate-pulse">Decrypting global plays...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plays.map((play, idx) => (
        <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">{play.ticker}</h3>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-1 rounded">
                {play.play_type}
              </span>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-bold ${play.direction === 'CALLS' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>
              {play.direction}
            </div>
          </div>
          
          <p className="text-sm text-neutral-300 mb-4">{play.thesis}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm font-mono bg-black p-3 rounded border border-neutral-800">
            <div><span className="text-neutral-500">Strike:</span> <span className="text-white">{play.strike}</span></div>
            <div><span className="text-neutral-500">Exp:</span> <span className="text-white">{play.expiration}</span></div>
            <div><span className="text-neutral-500">Entry:</span> <span className="text-white">${play.entry_price}</span></div>
            <div><span className="text-neutral-500">Edge:</span> <span className="text-green-400">{play.confidence}%</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}