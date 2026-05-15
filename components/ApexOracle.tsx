'use client';
import { useState } from 'react';

export default function ApexOracle() {
  const [ticker, setTicker] = useState('SPY');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const executeQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oracle/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, prompt }),
      });
      const data = await res.json();
      setResponse(data.analysis);
    } catch (err) {
      setResponse("❌ Neural Link severed. Backend unreachable.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-black border border-purple-500/30 rounded-lg p-6 max-w-2xl">
      <h2 className="text-purple-400 font-mono font-bold mb-4 flex items-center">
        <span className="mr-2">🧠</span> APEX ORACLE TERMINAL
      </h2>
      
      <form onSubmit={executeQuery} className="space-y-4">
        <div className="flex space-x-4">
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="TICKER" 
            className="w-24 bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500 font-mono uppercase"
            required 
          />
          <input 
            type="text" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Are institutions buying the dip right now?" 
            className="flex-1 bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500 font-mono"
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'SCANNING...' : 'EXECUTE'}
          </button>
        </div>
      </form>

      {response && (
        <div className="mt-6 bg-neutral-900 border border-neutral-800 p-4 rounded text-sm text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed">
          {response}
        </div>
      )}
    </div>
  );
}