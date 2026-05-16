"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, Globe, TrendingUp, Anchor, Lock, Activity } from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app"; 

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('API Error');
  return res.json();
});

export default function HomeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // FETCHERS
  const { data: newsData } = useSWR(`${ENGINE_URL}/api/news`, fetcher, { refreshInterval: 120000 });
  const { data: whaleData } = useSWR(`${ENGINE_URL}/api/flow/whales`, fetcher, { refreshInterval: 30000 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-screen bg-[#090014] items-center justify-center text-fuchsia-500 font-mono text-sm">
        <Activity className="w-12 h-12 mb-4 animate-pulse" />
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (status === "unauthenticated") {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);
      setAuthError("");
      const res = await signIn('credentials', { redirect: false, username, password });
      if (res?.error) {
        setAuthError("ACCESS DENIED.");
        setPassword("");
        setIsAuthenticating(false);
      }
    };

    return (
      <div className="flex h-screen bg-[#090014] items-center justify-center font-mono p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-900/20 blur-[150px] rounded-full z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full z-0" />
        <div className="bg-[#14002e]/60 backdrop-blur-xl border border-purple-500/30 p-8 md:p-10 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.1)] max-w-md w-full text-center relative z-10">
          <Lock className="w-8 h-8 text-fuchsia-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white tracking-widest mb-2">ACE'S HOUSE</h1>
          <p className="text-fuchsia-400/60 text-xs tracking-widest mb-8">INSTITUTIONAL TERMINAL</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <input type="text" placeholder="OPERATIVE ID" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/50 border border-purple-500/20 text-white rounded-md py-3 px-4 text-sm focus:border-fuchsia-500 outline-none transition-colors" required />
            <input type="password" placeholder="DECRYPTION KEY" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full bg-black/50 border ${authError ? 'border-red-500' : 'border-purple-500/20'} text-white rounded-md py-3 px-4 text-sm focus:border-fuchsia-500 outline-none transition-colors`} required />
            <button type="submit" disabled={isAuthenticating} className="w-full mt-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-md text-sm tracking-widest transition-colors shadow-[0_0_20px_rgba(217,70,239,0.4)]">
              {isAuthenticating ? 'DECRYPTING...' : 'INITIATE HANDSHAKE'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/${searchInput.toUpperCase().trim()}`);
    }
  };

  const whales = whaleData?.tape || [];
  
  const topMovers = [
    { ticker: "NVDA", change: "+4.2%", volume: "45.2M", dir: "up" },
    { ticker: "PLTR", change: "+3.8%", volume: "22.1M", dir: "up" },
    { ticker: "SMCI", change: "-5.1%", volume: "18.4M", dir: "down" },
    { ticker: "ARM", change: "+2.9%", volume: "12.0M", dir: "up" },
  ];

  return (
    <div className="flex h-screen bg-[#090014] text-white font-sans overflow-hidden">
      
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* PHILIPS HUE GLOWS */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* Header */}
        <header className="h-16 border-b border-purple-500/10 bg-[#090014]/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-10 gap-4">
          <h2 className="hidden md:block font-mono text-sm tracking-widest text-purple-200 font-bold">GLOBAL MACRO</h2>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fuchsia-500/50" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search Ticker ('/' to focus)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#14002e]/60 border border-purple-500/30 rounded-md py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:border-fuchsia-500 transition-colors uppercase shadow-[inset_0_0_10px_rgba(168,85,247,0.1)] text-white placeholder-purple-500/40"
            />
          </form>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-purple-300/50 uppercase hidden sm:block">{session?.user?.name}</span>
            <button onClick={() => signOut()} className="text-[10px] text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded border border-rose-500/20 font-bold tracking-widest transition-colors font-mono">DISCONNECT</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* BREAKING NEWS */}
            <div className="col-span-1 lg:col-span-2 bg-[#14002e]/40 border border-purple-500/20 rounded-xl overflow-hidden flex flex-col h-[350px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="p-4 border-b border-purple-500/10 flex items-center gap-2 bg-purple-900/10">
                <Globe className="w-4 h-4 text-fuchsia-400" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-purple-200">LIVE MACRO WIRE</h3>
              </div>
              <div className="p-4 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-3">
                {!newsData ? <div className="animate-pulse text-fuchsia-500/50 font-mono text-xs">PULLING LIVE WIRES...</div> : (newsData.news || []).map((item: any, i: number) => (
                  <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-4 bg-black/40 border border-purple-500/10 rounded-lg hover:border-fuchsia-500/40 hover:bg-purple-900/20 transition-all group">
                    <h4 className="text-sm font-medium text-gray-200 group-hover:text-fuchsia-300 transition-colors mb-2">{item.title}</h4>
                    <p className="text-[10px] text-purple-400/60 font-mono uppercase">{item.source}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* TOP MOVERS */}
            <div className="col-span-1 bg-[#14002e]/40 border border-purple-500/20 rounded-xl overflow-hidden flex flex-col h-[350px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="p-4 border-b border-purple-500/10 flex items-center gap-2 bg-purple-900/10">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-purple-200">MOMENTUM RADAR</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {topMovers.map((mover, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-black/40 border border-purple-500/10 rounded-lg">
                    <div className="flex flex-col">
                      <span className="font-bold text-white tracking-wider font-mono">{mover.ticker}</span>
                      <span className="text-[10px] text-purple-400/60 font-mono">VOL: {mover.volume}</span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${mover.dir === 'up' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.5)]'}`}>
                      {mover.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TRUE WHALE TAPE TABLE */}
          <div className="bg-[#14002e]/40 border border-purple-500/20 rounded-xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="p-4 border-b border-purple-500/10 flex items-center gap-2 bg-purple-900/10">
              <Anchor className="w-4 h-4 text-fuchsia-500" />
              <h3 className="text-xs font-bold font-mono tracking-widest text-purple-200">INSTITUTIONAL WHALE TAPE (&gt;$2M)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-500/10 bg-black/60 text-[10px] uppercase font-mono text-purple-400 tracking-widest">
                    <th className="p-4 font-semibold whitespace-nowrap">Time (PT)</th>
                    <th className="p-4 font-semibold">Ticker</th>
                    <th className="p-4 font-semibold">Contract</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Strike / Exp</th>
                    <th className="p-4 font-semibold">Premium</th>
                    <th className="p-4 font-semibold">Volume</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {whales.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-fuchsia-500/50 tracking-widest animate-pulse">
                        SCANNING POLYGON MATRIX FOR UNUSUAL FLOW...
                      </td>
                    </tr>
                  ) : whales.map((whale: any, idx: number) => (
                    <tr key={idx} className="border-b border-purple-500/5 hover:bg-purple-900/20 transition-colors">
                      <td className="p-4 text-purple-300/50">{whale.time}</td>
                      <td className="p-4 font-bold text-white text-sm">{whale.ticker}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded bg-opacity-20 border ${whale.ctype === 'CALL' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                          {whale.ctype}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 whitespace-nowrap">{whale.strike} <span className="text-purple-500/30 mx-1">|</span> {whale.expiration}</td>
                      <td className="p-4 font-bold text-fuchsia-400">{whale.premium}</td>
                      <td className="p-4 text-purple-300/70">{whale.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}