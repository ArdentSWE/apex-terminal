"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, Activity, Globe, Zap, Clock, ShieldAlert, Lock, User, KeyRound } from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
import WhaleTape from '@/components/WhaleTape';

const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app"; 

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('API Error');
  return res.json();
});

export default function TerminalGlobal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center text-cyan-500 font-mono text-sm">
        <Activity className="w-12 h-12 mb-4 animate-pulse" />
      </div>
    );
  }

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
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center font-mono p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[150px] rounded-full z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full z-0" />
        <div className="bg-[#111]/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-lg shadow-2xl max-w-md w-full text-center relative z-10">
          <Lock className="w-8 h-8 text-cyan-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white tracking-widest mb-2">ACE'S HOUSE</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left mt-8">
            <input type="text" placeholder="OPERATIVE ID" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#1a1a1a]/80 border border-white/10 text-white rounded py-2 px-3 text-sm focus:border-cyan-500 outline-none" required />
            <input type="password" placeholder="DECRYPTION KEY" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full bg-[#1a1a1a]/80 border ${authError ? 'border-red-500' : 'border-white/10'} text-white rounded py-2 px-3 text-sm focus:border-cyan-500 outline-none`} required />
            <button type="submit" disabled={isAuthenticating} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded text-sm tracking-widest transition-colors">
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

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none z-0" />

      <header className="h-auto lg:h-16 border-b border-white/5 bg-[#111]/80 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between p-4 lg:px-6 shrink-0 gap-4 lg:gap-0 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center">
            <Activity className="text-cyan-400 w-4 h-4" />
          </div>
          <span className="font-mono font-bold tracking-widest text-base md:text-lg">ACE'S HOUSE</span>
        </div>

        <form onSubmit={handleSearch} className="relative w-full lg:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search Ticker (Press '/' to focus)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-md py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase shadow-inner backdrop-blur-md"
          />
        </form>

        <div className="font-mono text-sm flex flex-wrap items-center gap-4">
          <span className="text-gray-400 text-[10px] md:text-xs">TELEMETRY: <span className="text-cyan-400 font-bold ml-1">GLOBAL MACRO</span></span>
          <div className="flex items-center gap-3 pl-4 border-l border-[#333]">
            <span className="text-[10px] md:text-xs text-gray-300 font-bold uppercase hidden md:inline-block">{session?.user?.name}</span>
            <button onClick={() => signOut()} className="text-[10px] md:text-xs text-red-400 hover:text-red-300 transition-colors font-bold tracking-widest bg-red-500/10 border border-red-500/30 px-2 py-1 rounded">DISCONNECT</button>
          </div>
        </div>
      </header>

      <div className="z-10 relative shrink-0 cursor-move">
        <WhaleTape />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <GlobalDashboard />
      </div>
    </div>
  );
}

const GlobalDashboard = React.memo(function GlobalDashboard() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { data: newsData } = useSWR(`${ENGINE_URL}/api/news`, fetcher);
  // Auto-refresh the algorithmic scanner every 60 seconds
  const { data: playsData, isLoading: loadingPlays } = useSWR(`${ENGINE_URL}/api/equities/global_plays`, fetcher, { refreshInterval: 60000 });

  useEffect(() => setMounted(true), []);

  const layout = [
    { i: "news", x: 0, y: 0, w: 3, h: 5, minW: 3, minH: 3 },
    { i: "day", x: 3, y: 0, w: 3, h: 5, minW: 3, minH: 3 },
    { i: "swing", x: 6, y: 0, w: 3, h: 5, minW: 3, minH: 3 },
    { i: "leap", x: 9, y: 0, w: 3, h: 5, minW: 3, minH: 3 }
  ];

  if (!mounted) return null;

  const plays = playsData?.plays || [];
  const dayTrades = plays.filter((p: any) => p.play_type === "DAY TRADE");
  const swings = plays.filter((p: any) => p.play_type === "SWING");
  const leaps = plays.filter((p: any) => p.play_type === "LEAP" || p.play_type === "WHALE");

  const renderPlayCard = (play: any, colorTheme: string) => (
    <div key={play.ticker} onClick={() => router.push(`/${play.ticker}`)} className="flex flex-col p-4 bg-[#1a1a1a]/80 border border-white/5 rounded shadow-inner cursor-pointer hover:border-cyan-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-2 border-b border-[#333] pb-2">
        <span className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">{play.ticker}</span>
        <div className={`px-2 py-1 text-xs font-bold font-mono rounded ${play.direction === 'CALLS' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
          {play.strike} {play.direction}
        </div>
      </div>
      <div className="flex justify-between mb-3 font-mono text-xs text-gray-400">
        <div>🎯 <span className="text-white">{play.confidence}%</span></div>
        <div>⏳ <span className="text-white">{play.expiration}</span></div>
      </div>
      <div className="text-xs text-gray-300 font-mono leading-relaxed line-clamp-3">
        {play.thesis.replace(/\*\*/g, '')}
      </div>
    </div>
  );

  return (
    <div className="p-2 lg:p-4 max-w-[1600px] mx-auto min-h-screen">
      <ResponsiveGridLayout className="layout" layouts={{ lg: layout }} breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} rowHeight={120} draggableHandle=".drag-handle" margin={[16, 16]}>
        
        {/* GLOBAL NEWS */}
        <div key="news" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 hover:bg-white/10">
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">BREAKING NEWS</h2>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
            {!newsData ? <p className="text-xs font-mono text-gray-500 animate-pulse">PULLING LIVE WIRES...</p> : (newsData.news || []).map((item: any, i: number) => (
              <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-3 bg-[#1a1a1a]/80 border border-white/5 rounded hover:border-cyan-500/50 transition-all">
                <h3 className="text-[13px] text-gray-200 font-medium mb-1 line-clamp-3">{item.title}</h3>
                <p className="text-[10px] text-gray-500 font-mono">{item.source}</p>
              </a>
            ))}
          </div>
        </div>

        {/* DAY TRADES */}
        <div key="day" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 hover:bg-white/10">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">DAY TRADES (0-7 DTE)</h2>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
            {loadingPlays ? <div className="text-cyan-500 font-mono text-xs animate-pulse text-center mt-10">SCANNING 100 TICKERS...</div> : 
             dayTrades.length === 0 ? <p className="text-xs font-mono text-gray-500 text-center mt-10">NO SETUPS ACTIVE.</p> :
             dayTrades.map((p: any) => renderPlayCard(p, 'yellow'))}
          </div>
        </div>

        {/* SWING TRADES */}
        <div key="swing" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 hover:bg-white/10">
            <Clock className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">SWING PLAYS (1-3 MO)</h2>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
            {loadingPlays ? <div className="text-purple-500 font-mono text-xs animate-pulse text-center mt-10">CALCULATING ORDER BLOCKS...</div> : 
             swings.length === 0 ? <p className="text-xs font-mono text-gray-500 text-center mt-10">NO SETUPS ACTIVE.</p> :
             swings.map((p: any) => renderPlayCard(p, 'purple'))}
          </div>
        </div>

        {/* LEAPS / WHALES */}
        <div key="leap" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 hover:bg-white/10">
            <ShieldAlert className="w-4 h-4 text-green-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">WHALE LEAPS (6+ MO)</h2>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
            {loadingPlays ? <div className="text-green-500 font-mono text-xs animate-pulse text-center mt-10">HUNTING DARK POOLS...</div> : 
             leaps.length === 0 ? <p className="text-xs font-mono text-gray-500 text-center mt-10">NO SETUPS ACTIVE.</p> :
             leaps.map((p: any) => renderPlayCard(p, 'green'))}
          </div>
        </div>

      </ResponsiveGridLayout>
    </div>
  );
});