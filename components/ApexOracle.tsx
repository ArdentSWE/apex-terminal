'use client';
import { useState } from 'react';

export default function ApexOracle() {
  const [ticker, setTicker] = useState('SPY');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded fallback to guarantee connection
  const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app";

  const executeQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${ENGINE_URL}/api/oracle/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, prompt }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: Engine refused connection.`);
      }
      
      const data = await res.json();
      setResponse(data.analysis || "Data parse failed. No analysis returned.");
    } catch (err: any) {
      setResponse(`❌ Neural Link severed: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111] border border-[#222] shadow-lg rounded-md p-4 lg:p-6 w-full">
      <h2 className="text-purple-400 font-mono font-bold mb-4 flex items-center text-xs tracking-widest">
        <span className="mr-2">🧠</span> APEX ORACLE TERMINAL
      </h2>
      
      <form onSubmit={executeQuery} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="TICKER" 
            className="w-full md:w-24 bg-[#1a1a1a] border border-[#333] text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500 font-mono uppercase text-sm"
            required 
          />
          <input 
            type="text" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Are institutions buying the dip right now?" 
            className="flex-1 bg-[#1a1a1a] border border-[#333] text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500 font-mono text-sm"
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 text-purple-400 px-6 py-2 rounded font-bold font-mono text-sm transition-colors disabled:opacity-50 min-w-[120px]"
          >
            {loading ? 'SCANNING...' : 'EXECUTE'}
          </button>
        </div>
      </form>

      {response && (
        <div className="mt-6 bg-[#1a1a1a] border border-[#333] p-4 rounded text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
          {response}
        </div>
      )}
    </div>
  );
}