"use client";
import React, { useState, useEffect } from 'react';
import { Search, Activity, BarChart2, Layers, Newspaper, Crosshair, Globe, ArrowLeft, Target, Zap, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const ENGINE_URL = "https://apex-engine-production.up.railway.app"; 

export default function Terminal() {
  const [searchInput, setSearchInput] = useState("");
  const [activeTicker, setActiveTicker] = useState<string | null>(null); // Null means Global View

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTicker(searchInput.toUpperCase().trim());
      setSearchInput(""); 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* HEADER & MASTER SEARCH */}
      <header className="h-16 border-b border-[#222] bg-[#111] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.2)]">
            <Activity className="text-cyan-400 w-4 h-4" />
          </div>
          <span className="font-mono font-bold tracking-widest text-lg">ACE'S HOUSE</span>
        </div>

        <form onSubmit={handleSearch} className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Ticker (e.g. SPY, NVDA)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-md py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase shadow-inner"
          />
        </form>

        <div className="font-mono text-sm text-gray-400 flex items-center gap-4">
          {activeTicker && (
            <button onClick={() => setActiveTicker(null)} className="flex items-center gap-1 text-xs hover:text-white transition-colors bg-[#222] px-3 py-1 rounded border border-[#333]">
              <ArrowLeft className="w-3 h-3" /> BACK TO GLOBAL
            </button>
          )}
          <span>TELEMETRY: <span className="text-cyan-400 font-bold ml-1">{activeTicker ? activeTicker : "GLOBAL MACRO"}</span></span>
        </div>
      </header>

      {/* DYNAMIC VIEW ROUTING */}
      {activeTicker ? <TickerDashboard ticker={activeTicker} /> : <GlobalDashboard />}

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
    // Fetch Macro News
    fetch(`${ENGINE_URL}/api/news`)
      .then(res => res.json())
      .then(data => setNews(data.news || []))
      .catch(() => setNews([]));

    // Fetch Global Trade Setups from Claude 4.7
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
    <main className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0">
      {/* LEFT COL: MACRO NEWS */}
      <section className="col-span-4 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
          <Globe className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest">GLOBAL BREAKING NEWS</h2>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
          {news.length === 0 ? <p className="text-xs font-mono text-gray-500 animate-pulse">PULLING LIVE WIRES...</p> : news.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-4 bg-[#1a1a1a] border border-[#333] rounded hover:border-cyan-500/50 transition-all cursor-pointer shrink-0">
              <h3 className="text-sm text-gray-200 font-medium mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 font-mono">Source: <span className="text-cyan-400">{item.source}</span></p>
            </a>
          ))}
        </div>
      </section>

      {/* RIGHT COL: AI ACTIVE PLAYS */}
      <section className="col-span-8 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">LIVE QUANTITATIVE SETUPS</h2>
          </div>
          <span className="text-xs font-mono text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-1 rounded">POWERED BY APEX OMNI-AGENT</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
          {loadingPlays ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500 font-mono text-sm">
              <Activity className="w-12 h-12 mb-4 animate-bounce" />
              <p className="animate-pulse">SCANNING SMART MONEY CONCEPTS...</p>
            </div>
          ) : plays.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-mono text-sm">
              <p>NO ACTIVE SETUPS FOUND. CHECK BACK AT OPEN.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {plays.map((play, i) => (
                <div key={i} className="flex flex-col p-5 bg-[#1a1a1a] border border-[#333] rounded shadow-inner">
                  <div className="flex justify-between items-start mb-3 border-b border-[#333] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-white">{play.ticker}</span>
                      <span className={`px-2 py-1 text-xs font-bold font-mono rounded border ${play.play_type === 'DAY TRADE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : play.play_type === 'SWING' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-purple-500/20 text-purple-400 border-purple-500/50'}`}>
                        {play.play_type}
                      </span>
                    </div>
                    <div className={`px-3 py-1 text-sm font-bold font-mono rounded ${play.direction === 'CALLS' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                      {play.strike} {play.direction}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-sm text-gray-400">
                    <div>🎯 Confidence: <span className="text-white font-bold">{play.confidence}%</span></div>
                    <div>⏳ Expiration: <span className="text-white font-bold">{play.expiration}</span></div>
                  </div>
                  <div className="text-sm text-gray-300 bg-[#111] border border-[#222] p-3 rounded font-mono leading-relaxed">
                    <span className="text-yellow-400 font-bold mr-2">🧠 THESIS:</span>{play.thesis}
                  </div>
                </div>
              ))}
              <div className="mt-4 border-t border-[#333] pt-4">
                  <p className="text-xs text-gray-500 font-mono italic">
                    ⚠️ RISK DISCLOSURE: This data is generated autonomously via algorithmic scans. It is NOT financial advice. Options carry extreme variance. Tail strictly at your own risk.
                  </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ------------------------------------------------------------------
// VIEW 2: TICKER SPECIFIC DASHBOARD
// ------------------------------------------------------------------
function TickerDashboard({ ticker }: { ticker: string }) {
  return (
    <main className="flex-1 p-4 grid grid-cols-12 grid-rows-2 gap-4 min-h-0">
      
      {/* MODULE 1: GEX SURFACE (Spans 8 columns, Top Row) */}
      <section className="col-span-8 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest">GAMMA EXPOSURE (GEX) - {ticker}</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <GexSurface ticker={ticker} />
        </div>
      </section>

      {/* MODULE 2: OPTIONS FLOW TAPE (Spans 4 columns, Top Row) */}
      <section className="col-span-4 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest">LIVE PREMIUM FLOW</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <OptionsFlow ticker={ticker} />
        </div>
      </section>

      {/* MODULE 3: AI TRADE THESIS (Spans 5 columns, Bottom Row) */}
      <section className="col-span-5 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">APEX AI THESIS</h2>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <TickerAiThesis ticker={ticker} />
        </div>
      </section>

      {/* MODULE 4: HEATMAP (Spans 4 columns, Bottom Row) */}
      <section className="col-span-4 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
           <Activity className="w-4 h-4 text-orange-400" />
           <h2 className="text-xs font-bold text-gray-400 tracking-widest">OPTIONS MATRIX</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <OptionsHeatmap ticker={ticker} />
        </div>
      </section>

      {/* MODULE 5: TICKER NEWS (Spans 3 columns, Bottom Row) */}
      <section className="col-span-3 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
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
// SUB-COMPONENTS FOR TICKER DASHBOARD
// ------------------------------------------------------------------

function TickerAiThesis({ ticker }: { ticker: string }) {
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/equities/ticker_idea?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => {
        setIdea(data.idea);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ticker]);

  if (loading) return <div className="text-cyan-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">GENERATING QUANT THESIS...</div>;
  if (!idea) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">INSUFFICIENT DATA TO GENERATE THESIS.</div>;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-2 py-1 text-xs font-bold font-mono rounded border ${idea.play_type === 'DAY TRADE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>
          {idea.play_type}
        </span>
        <span className="text-sm font-mono text-gray-400">EDGE: <span className="text-white font-bold">{idea.confidence}%</span></span>
      </div>
      
      <div className={`text-center py-4 mb-4 rounded border font-mono font-bold text-lg tracking-widest ${idea.direction === 'CALLS' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
        {idea.strike} {idea.direction} ({idea.expiration})
      </div>

      <div className="text-sm text-gray-300 font-mono leading-relaxed">
        <p className="mb-2"><ShieldAlert className="w-4 h-4 inline mr-1 text-purple-400"/> **INSTITUTIONAL READ:**</p>
        <p>{idea.thesis}</p>
      </div>
    </div>
  );
}

function GexSurface({ ticker }: { ticker: string }) {
  const [gexData, setGexData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback visualizer data since backend is mocked for GEX currently
  const fallbackData = [
    { strike: 400, gex: -1500 }, { strike: 405, gex: -800 }, 
    { strike: 410, gex: -200 }, { strike: 415, gex: 1200 }, 
    { strike: 420, gex: 3500 }, { strike: 425, gex: 1800 }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/gex?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        setGexData(data.data?.length ? data.data : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setGexData(fallbackData);
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">CALCULATING GAMMA WALLS...</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={gexData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="strike" stroke="#555" tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} />
        <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} />
        <Tooltip cursor={{ fill: '#222' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }} formatter={(value: any) => [`${value}M`, 'Gamma']} />
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

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/flow?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        setTape(data.tape || []);
        setLoading(false);
      })
      .catch(() => {
        setTape([]); 
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">SCANNING DARK POOLS...</div>;
  if (tape.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO FLOW DETECTED.</div>;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-full">
      {tape.map((trade, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-[#1a1a1a] border border-[#333] hover:border-[#444] rounded text-sm font-mono shrink-0 transition-colors">
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-wider">{trade.ticker}</span>
            <span className="text-xs text-gray-500">{trade.time}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-red-400 font-bold">{trade.premium}</span>
            <span className="text-xs text-gray-400">Size: {trade.size}</span>
          </div>
        </div>
      ))}
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
      .then((data) => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch(() => {
        setNews([]); 
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">PULLING WIRE...</div>;
  if (news.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO NEWS FOUND.</div>;

  return (
    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
      {news.map((item, i) => (
        <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-3 bg-[#1a1a1a] border border-[#333] rounded hover:border-cyan-500/50 transition-all cursor-pointer shrink-0">
          <h3 className="text-sm text-gray-200 font-medium mb-1 line-clamp-2">{item.title}</h3>
          <p className="text-xs text-gray-500 font-mono">{item.source}</p>
        </a>
      ))}
    </div>
  );
}

function OptionsHeatmap({ ticker }: { ticker: string }) {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackData = [
    { strike: 430, exp1: 80, exp2: 40, exp3: 20 },
    { strike: 425, exp1: 150, exp2: 90, exp3: 45 },
    { strike: 420, exp1: 300, exp2: 210, exp3: 110 },
    { strike: 415, exp1: 800, exp2: 450, exp3: 200 }, 
    { strike: 410, exp1: 250, exp2: 180, exp3: 90 },
    { strike: 405, exp1: 100, exp2: 60, exp3: 30 },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/heatmap?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        setHeatmapData(data.data?.length ? data.data : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setHeatmapData(fallbackData); 
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">RENDERING MATRIX...</div>;

  const getCellColor = (vol: number) => {
    if (vol > 500) return 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(0,255,255,0.5)] border border-cyan-300';
    if (vol > 200) return 'bg-cyan-500/60 text-white border border-cyan-500/50';
    if (vol > 100) return 'bg-cyan-500/30 text-gray-300 border border-[#333]';
    return 'bg-[#1a1a1a] text-gray-500 border border-[#333]';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-mono text-xs">
      <div className="grid grid-cols-4 gap-1 mb-2 text-gray-400 font-bold text-center border-b border-[#333] pb-2 shrink-0">
        <div>STRIKE</div>
        <div>0 DTE</div>
        <div>7 DTE</div>
        <div>30 DTE</div>
      </div>
      
      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
        {heatmapData.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-1 text-center">
            <div className="flex items-center justify-center bg-[#222] border border-[#333] rounded py-2 font-bold text-gray-200">${row.strike}</div>
            <div className={`flex items-center justify-center rounded py-2 transition-colors ${getCellColor(row.exp1)}`}>{row.exp1}</div>
            <div className={`flex items-center justify-center rounded py-2 transition-colors ${getCellColor(row.exp2)}`}>{row.exp2}</div>
            <div className={`flex items-center justify-center rounded py-2 transition-colors ${getCellColor(row.exp3)}`}>{row.exp3}</div>
          </div>
        ))}
      </div>
    </div>
  );
}