"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, Activity, BarChart2, Layers, Newspaper, Globe, ArrowLeft, Target, Zap, ShieldAlert, Lock, User, KeyRound } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

// Import the new Phase 3 Components
import WhaleTape from '@/components/WhaleTape';
import ApexOracle from '@/components/ApexOracle';

const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app"; 

// Markdown Parser
const formatMarkdown = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className={`mb-2 ${line.startsWith('-') ? 'pl-4 border-l-2 border-[#333] ml-2' : ''}`}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
};

export default function Terminal() {
  const { data: session, status } = useSession();
  const [searchInput, setSearchInput] = useState("");
  const [activeTicker, setActiveTicker] = useState<string | null>(null);

  // Login Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // ------------------------------------------------------------------
  // STATE 1: LOADING
  // ------------------------------------------------------------------
  if (status === "loading") {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center text-cyan-500 font-mono text-sm relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="flex flex-col items-center animate-pulse relative z-10">
          <Activity className="w-12 h-12 mb-4" />
          <p>ESTABLISHING SECURE CONNECTION...</p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // STATE 2: THE GATEKEEPER (UNAUTHENTICATED)
  // ------------------------------------------------------------------
  if (status === "unauthenticated") {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);
      setAuthError("");

      const res = await signIn('credentials', {
        redirect: false,
        username,
        password
      });

      if (res?.error) {
        setAuthError("ACCESS DENIED. INVALID CREDENTIALS.");
        setPassword("");
        setIsAuthenticating(false);
      }
    };

    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center font-mono p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
        
        <div className="bg-[#111]/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-md w-full text-center relative z-10">
          <div className="w-16 h-16 mx-auto bg-cyan-500/10 border border-cyan-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <Lock className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-widest mb-2">ACE'S HOUSE</h1>
          <p className="text-[10px] md:text-xs text-gray-500 mb-8 uppercase">Restricted Quantitative Terminal</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-[10px] md:text-xs text-gray-400 tracking-widest mb-1 flex items-center gap-2"><User className="w-3 h-3" /> OPERATIVE ID</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1a1a1a]/80 border border-white/10 text-white rounded py-2 px-3 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="text-[10px] md:text-xs text-gray-400 tracking-widest mb-1 flex items-center gap-2"><KeyRound className="w-3 h-3" /> DECRYPTION KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#1a1a1a]/80 border ${authError ? 'border-red-500' : 'border-white/10'} text-white rounded py-2 px-3 focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                required
              />
              {authError && <p className="text-[10px] md:text-xs text-red-500 mt-2 font-bold">{authError}</p>}
            </div>
            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full mt-4 bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm disabled:bg-cyan-800 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-3 tracking-widest text-xs md:text-sm border border-cyan-400/50"
            >
              {isAuthenticating ? <Activity className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />} 
              {isAuthenticating ? 'DECRYPTING...' : 'INITIATE HANDSHAKE'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // STATE 3: THE MATRIX (AUTHENTICATED)
  // ------------------------------------------------------------------
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTicker(searchInput.toUpperCase().trim());
      setSearchInput(""); 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative">
      
      {/* --- RADIAL AMBIENT GLOWS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* MOBILE-RESPONSIVE HEADER WITH LOGOUT */}
      <header className="h-auto lg:h-16 border-b border-white/5 bg-[#111]/80 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between p-4 lg:px-6 shrink-0 gap-4 lg:gap-0 z-20 relative">
        
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.2)]">
              <Activity className="text-cyan-400 w-4 h-4" />
            </div>
            <span className="font-mono font-bold tracking-widest text-base md:text-lg">ACE'S HOUSE</span>
          </div>
          
          {activeTicker && (
            <button onClick={() => setActiveTicker(null)} className="lg:hidden flex items-center gap-1 text-[10px] hover:text-white text-gray-400 transition-colors bg-[#222]/80 px-2 py-1 rounded border border-white/10">
              <ArrowLeft className="w-3 h-3" /> BACK
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="relative w-full lg:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Ticker (e.g. SPY, NVDA)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-md py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase shadow-inner backdrop-blur-md"
          />
        </form>

        <div className="font-mono text-sm flex flex-wrap items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-4">
            {activeTicker && (
              <button onClick={() => setActiveTicker(null)} className="hidden lg:flex items-center gap-1 text-xs hover:text-white text-gray-400 transition-colors bg-[#222]/80 px-3 py-1 rounded border border-white/10">
                <ArrowLeft className="w-3 h-3" /> BACK TO GLOBAL
              </button>
            )}
            <span className="text-gray-400 text-[10px] md:text-xs">TELEMETRY: <span className="text-cyan-400 font-bold ml-1">{activeTicker ? activeTicker : "GLOBAL MACRO"}</span></span>
          </div>
          
          {/* USER PROFILE & LOGOUT */}
          <div className="flex items-center gap-3 lg:pl-4 lg:border-l border-[#333]">
            <span className="text-[10px] md:text-xs text-gray-300 font-bold uppercase hidden md:inline-block">{session?.user?.name}</span>
            <button onClick={() => signOut()} className="text-[10px] md:text-xs text-red-400 hover:text-red-300 transition-colors font-bold tracking-widest bg-red-500/10 border border-red-500/30 px-2 py-1 rounded backdrop-blur-sm">DISCONNECT</button>
          </div>
        </div>
      </header>

      {/* WHALE TAPE SCROLLING MARQUEE */}
      <div className="z-10 relative">
        <WhaleTape />
      </div>

      {/* DYNAMIC VIEW ROUTING */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        {activeTicker ? <TickerDashboard ticker={activeTicker} /> : <GlobalDashboard />}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// VIEW 1: GLOBAL MACRO DASHBOARD
// ------------------------------------------------------------------
function GlobalDashboard() {
  const [news, setNews] = useState<any[]>([]);
  const [plays, setPlays] = useState<any[]>([]);
  const [loadingPlays, setLoadingPlays] = useState(true);

  useEffect(() => {
    fetch(`${ENGINE_URL}/api/news`)
      .then(res => res.json())
      .then(data => setNews(data.news || []))
      .catch(() => setNews([]));

    setLoadingPlays(true);
    fetch(`${ENGINE_URL}/api/equities/global_plays`)
      .then(res => res.json())
      .then(data => {
        setPlays(data.plays || []);
        setLoadingPlays(false);
      })
      .catch(() => setLoadingPlays(false));
  }, []);

  return (
    <main className="p-3 lg:p-4 flex flex-col gap-4 max-w-[1600px] mx-auto">
      
      {/* TOP ROW: NEWS & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <section className="col-span-1 lg:col-span-4 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg h-[400px] lg:h-[500px]">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 shrink-0">
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">GLOBAL BREAKING NEWS</h2>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
            {news.length === 0 ? <p className="text-xs font-mono text-gray-500 animate-pulse">PULLING LIVE WIRES...</p> : news.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-4 bg-[#1a1a1a]/80 border border-white/5 rounded hover:border-cyan-500/50 transition-all cursor-pointer shrink-0">
                <h3 className="text-sm text-gray-200 font-medium mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 font-mono">Source: <span className="text-cyan-400">{item.source}</span></p>
              </a>
            ))}
          </div>
        </section>

        <section className="col-span-1 lg:col-span-8 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg overflow-hidden h-[400px] lg:h-[500px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-white/10 pb-2 shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h2 className="text-xs font-bold text-gray-400 tracking-widest">LIVE QUANTITATIVE SETUPS</h2>
            </div>
            <span className="text-[10px] md:text-xs font-mono text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-1 rounded inline-block w-fit">POWERED BY APEX OMNI-AGENT</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
            {loadingPlays ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500 font-mono text-sm">
                <Activity className="w-12 h-12 mb-4 animate-bounce" />
                <p className="animate-pulse">SCANNING SMART MONEY CONCEPTS...</p>
              </div>
            ) : plays.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-mono text-sm text-center px-4">
                <p>NO ACTIVE SETUPS FOUND. CHECK BACK AT OPEN.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {plays.map((play, i) => (
                  <div key={i} className="flex flex-col p-4 md:p-5 bg-[#1a1a1a]/80 border border-white/5 rounded shadow-inner">
                    <div className="flex flex-wrap justify-between items-start mb-3 border-b border-[#333] pb-3 gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl md:text-2xl font-black text-white">{play.ticker}</span>
                        <span className={`px-2 py-1 text-[10px] md:text-xs font-bold font-mono rounded border ${play.play_type === 'DAY TRADE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : play.play_type === 'SWING' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-purple-500/20 text-purple-400 border-purple-500/50'}`}>
                          {play.play_type}
                        </span>
                      </div>
                      <div className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm font-bold font-mono rounded ${play.direction === 'CALLS' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                        {play.strike} {play.direction}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 font-mono text-xs md:text-sm text-gray-400">
                      <div>🎯 Confidence: <span className="text-white font-bold">{play.confidence}%</span></div>
                      <div>⏳ Expiration: <span className="text-white font-bold">{play.expiration}</span></div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 bg-[#0a0a0a]/50 border border-white/5 p-3 rounded font-mono leading-relaxed">
                      <span className="text-yellow-400 font-bold mr-2">🧠 THESIS:</span>{play.thesis}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* BOTTOM ROW: APEX ORACLE CHAT */}
      <section className="w-full">
        <ApexOracle />
      </section>

    </main>
  );
}

// ------------------------------------------------------------------
// VIEW 2: TICKER SPECIFIC DASHBOARD
// ------------------------------------------------------------------
function TickerDashboard({ ticker }: { ticker: string }) {
  return (
    <main className="p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-4 max-w-[1600px] mx-auto">
      
      <section className="col-span-1 lg:col-span-8 lg:row-span-1 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg min-h-[350px] lg:min-h-0">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 shrink-0">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest">GAMMA EXPOSURE (GEX) - {ticker}</h2>
        </div>
        <div className="flex-1 overflow-hidden min-h-[250px]">
          <GexSurface ticker={ticker} />
        </div>
      </section>

      <section className="col-span-1 lg:col-span-4 lg:row-span-1 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg h-[350px] lg:h-auto">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 shrink-0">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest">LIVE PREMIUM FLOW</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <OptionsFlow ticker={ticker} />
        </div>
      </section>

      <section className="col-span-1 lg:col-span-5 lg:row-span-1 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg min-h-[350px] lg:min-h-0">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">APEX AI THESIS</h2>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <TickerAiThesis ticker={ticker} />
        </div>
      </section>

      <section className="col-span-1 lg:col-span-4 lg:row-span-1 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg h-[350px] lg:h-auto">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 shrink-0">
           <Activity className="w-4 h-4 text-orange-400" />
           <h2 className="text-xs font-bold text-gray-400 tracking-widest">OPTIONS MATRIX</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <OptionsHeatmap ticker={ticker} />
        </div>
      </section>

      <section className="col-span-1 lg:col-span-3 lg:row-span-1 bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md p-4 flex flex-col shadow-lg h-[350px] lg:h-auto">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 shrink-0">
          <Newspaper className="w-4 h-4 text-yellow-400" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest">TICKER DOCKET</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <MacroDocket ticker={ticker} />
        </div>
      </section>

    </main>
  );
}

// ------------------------------------------------------------------
// SUB-COMPONENTS
// ------------------------------------------------------------------
function TickerAiThesis({ ticker }: { ticker: string }) {
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/equities/ticker_idea?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => { setIdea(data.idea); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  if (loading) return <div className="text-cyan-500 font-mono text-sm h-full flex items-center justify-center animate-pulse text-center px-4">GENERATING QUANT THESIS...</div>;
  if (!idea) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center text-center px-4">INSUFFICIENT DATA TO GENERATE THESIS.</div>;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-2 py-1 text-[10px] md:text-xs font-bold font-mono rounded border ${idea.play_type === 'DAY TRADE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>
          {idea.play_type}
        </span>
        <span className="text-xs md:text-sm font-mono text-gray-400">EDGE: <span className="text-white font-bold">{idea.confidence}%</span></span>
      </div>
      
      <div className={`text-center py-3 md:py-4 mb-4 rounded border font-mono font-bold text-base md:text-lg tracking-widest ${idea.direction === 'CALLS' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
        {idea.strike} {idea.direction} <span className="block text-xs md:inline md:ml-2">({idea.expiration})</span>
      </div>

      <div className="text-xs md:text-sm text-gray-300 font-mono leading-relaxed">
        <div className="mb-2"><ShieldAlert className="w-4 h-4 inline mr-1 text-purple-400"/> <strong className="text-white">INSTITUTIONAL READ:</strong></div>
        {formatMarkdown(idea.thesis)}
      </div>
    </div>
  );
}

function GexSurface({ ticker }: { ticker: string }) {
  const [gexData, setGexData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/gex?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => { setGexData(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse text-center px-4">CALCULATING GAMMA WALLS...</div>;
  if (gexData.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center text-center px-4">NO GEX DATA FOUND.</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={gexData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="strike" stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
        <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} width={40} />
        <Tooltip cursor={{ fill: '#222' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', fontFamily: 'monospace', fontSize: '10px' }} formatter={(value: any) => [`${value}`, 'Net Gamma']} />
        <ReferenceLine y={0} stroke="#444" />
        <Bar dataKey="gex" radius={[2, 2, 0, 0]}>
          {gexData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.gex > 0 ? '#00ffff' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function OptionsFlow({ ticker }: { ticker: string }) {
  const [tape, setTape] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- THE SCALPEL: Filter States ---
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app";

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/flow?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => { setTape(data.tape || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  // --- THE ENGINE: Frontend Data Slicing ---
  const filteredTape = tape.filter(trade => {
    // 1. Filter by Flow Type (Calls vs Puts)
    if (typeFilter !== 'ALL' && trade.ctype && trade.ctype !== typeFilter) return false;

    // 2. Filter by Premium Size
    if (sizeFilter !== 'ALL') {
      const prem = trade.premium || "";
      if (sizeFilter === '1M+' && !prem.includes('M')) return false;
      if (sizeFilter === '500K+') {
         if (!prem.includes('M') && !prem.includes('K')) return false;
         if (prem.includes('K')) {
           const num = parseFloat(prem.replace(/[^0-9.]/g, ''));
           if (num < 500) return false;
         }
      }
    }
    return true;
  });

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">SCANNING DARK POOLS...</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* THE CONTROL PANEL */}
      <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-white/5 shrink-0">
        
        {/* Type Toggles */}
        <div className="flex bg-black rounded border border-white/10 overflow-hidden text-[10px] shadow-inner">
          <button onClick={() => setTypeFilter('ALL')} className={`px-3 py-1 transition-colors ${typeFilter === 'ALL' ? 'bg-white/20 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}>ALL</button>
          <button onClick={() => setTypeFilter('CALL')} className={`px-3 py-1 transition-colors ${typeFilter === 'CALL' ? 'bg-cyan-500/20 text-cyan-400 font-bold border-x border-cyan-500/30' : 'text-gray-500 hover:text-gray-300 border-x border-white/5'}`}>CALLS</button>
          <button onClick={() => setTypeFilter('PUT')} className={`px-3 py-1 transition-colors ${typeFilter === 'PUT' ? 'bg-fuchsia-500/20 text-fuchsia-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}>PUTS</button>
        </div>
        
        {/* Size Toggles */}
        <div className="flex bg-black rounded border border-white/10 overflow-hidden text-[10px] shadow-inner">
          <button onClick={() => setSizeFilter('ALL')} className={`px-3 py-1 transition-colors ${sizeFilter === 'ALL' ? 'bg-white/20 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}>SIZE: ALL</button>
          <button onClick={() => setSizeFilter('500K+')} className={`px-3 py-1 transition-colors ${sizeFilter === '500K+' ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l border-yellow-500/30' : 'text-gray-500 hover:text-gray-300 border-l border-white/5'}`}>500K+</button>
          <button onClick={() => setSizeFilter('1M+')} className={`px-3 py-1 transition-colors ${sizeFilter === '1M+' ? 'bg-green-500/20 text-green-400 font-bold border-l border-green-500/30' : 'text-gray-500 hover:text-gray-300 border-l border-white/5'}`}>1M+</button>
        </div>

      </div>

      {/* THE TAPE */}
      <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-full">
        {filteredTape.length === 0 ? (
           <div className="text-gray-500 font-mono text-xs text-center py-4">NO FLOW MATCHES ACTIVE FILTERS.</div>
        ) : (
           filteredTape.map((trade, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#1a1a1a]/80 border border-white/5 hover:border-cyan-500/50 rounded text-sm font-mono shrink-0 transition-colors">
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-wider">
                  {trade.ticker} 
                  <span className={`text-[10px] ml-2 px-1 rounded border ${trade.ctype === 'CALL' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10'}`}>
                    {trade.ctype || 'SWEEP'}
                  </span>
                </span>
                <span className="text-xs text-gray-500 mt-1">{trade.time}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-green-400 font-bold">{trade.premium}</span>
                <span className="text-xs text-gray-400">Size: {trade.size}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MacroDocket({ ticker }: { ticker: string }) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/news?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => { setNews(data.news || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">PULLING WIRE...</div>;
  if (news.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO NEWS FOUND.</div>;

  return (
    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
      {news.map((item, i) => (
        <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-3 bg-[#1a1a1a]/80 border border-white/5 rounded hover:border-cyan-500/50 transition-all cursor-pointer shrink-0">
          <h3 className="text-[13px] md:text-sm text-gray-200 font-medium mb-1 line-clamp-2">{item.title}</h3>
          <p className="text-[10px] md:text-xs text-gray-500 font-mono">{item.source}</p>
        </a>
      ))}
    </div>
  );
}

function OptionsHeatmap({ ticker }: { ticker: string }) {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/heatmap?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => { setHeatmapData(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">RENDERING MATRIX...</div>;
  if (heatmapData.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO MATRIX DATA FOUND.</div>;

  const getCellColor = (vol: number) => {
    if (vol > 500) return 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(0,255,255,0.5)] border border-cyan-300';
    if (vol > 200) return 'bg-cyan-500/60 text-white border border-cyan-500/50';
    if (vol > 100) return 'bg-cyan-500/30 text-gray-300 border border-white/5';
    if (vol > 0) return 'bg-[#1a1a1a]/80 text-gray-500 border border-white/5';
    return 'text-gray-700';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-mono text-[10px] md:text-xs">
      <div className="grid grid-cols-4 gap-1 mb-2 text-gray-400 font-bold text-center border-b border-white/10 pb-2 shrink-0">
        <div>STRIKE</div>
        <div>NEAR</div>
        <div>MID</div>
        <div>FAR</div>
      </div>
      
      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
        {heatmapData.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-1 text-center">
            <div className="flex items-center justify-center bg-[#222]/80 border border-white/5 rounded py-2 font-bold text-gray-200">${row.strike}</div>
            <div className={`flex items-center justify-center rounded py-2 transition-colors ${getCellColor(row.exp1)}`}>{row.exp1 > 0 ? row.exp1 : '-'}</div>
            <div className={`flex items-center justify-center rounded py-2 transition-colors ${getCellColor(row.exp2)}`}>{row.exp2 > 0 ? row.exp2 : '-'}</div>
            <div className={`flex items-center justify-center rounded py-2 transition-colors ${getCellColor(row.exp3)}`}>{row.exp3 > 0 ? row.exp3 : '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}