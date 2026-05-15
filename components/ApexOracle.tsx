'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Cybernetic Typing Effect ---
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Adjust speed here (lower is faster)
    
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

export default function ApexOracle() {
  const [ticker, setTicker] = useState('SPY');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

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
      
      if (!res.ok) throw new Error(`HTTP Error ${res.status}: Engine refused connection.`);
      
      const data = await res.json();
      setResponse(data.analysis || "Data parse failed. No analysis returned.");
    } catch (err: any) {
      setResponse(`❌ Neural Link severed: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111]/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-md p-4 lg:p-6 w-full relative overflow-hidden">
      {/* Subtle internal glow for the Oracle card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full" />

      <h2 className="text-purple-400 font-mono font-bold mb-4 flex items-center text-xs tracking-widest relative z-10">
        <span className="mr-2 animate-pulse">🧠</span> APEX ORACLE TERMINAL
      </h2>
      
      <form onSubmit={executeQuery} className="space-y-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="TICKER" 
            className="w-full md:w-24 bg-[#1a1a1a]/80 border border-white/10 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500 focus:bg-black font-mono uppercase text-sm transition-all"
            required 
          />
          <input 
            type="text" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Are institutions buying the dip right now?" 
            className="flex-1 bg-[#1a1a1a]/80 border border-white/10 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500 focus:bg-black font-mono text-sm transition-all"
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] text-purple-400 px-6 py-2 rounded font-bold font-mono text-sm transition-all disabled:opacity-50 min-w-[120px]"
          >
            {loading ? 'SCANNING...' : 'EXECUTE'}
          </button>
        </div>
      </form>

      {response && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-6 bg-black/50 backdrop-blur-md border border-purple-500/20 p-4 rounded text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed shadow-inner relative z-10"
        >
          <TypewriterText text={response} />
        </motion.div>
      )}
    </div>
  );
}