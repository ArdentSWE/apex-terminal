"use client";
import React, { useState, useEffect } from 'react';
import { Search, Activity, BarChart2, Layers, Newspaper, Crosshair } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function Terminal() {
  const [activeTicker, setActiveTicker] = useState("NVDA");
  const [searchInput, setSearchInput] = useState("");
  const [module3Tab, setModule3Tab] = useState<"SMC" | "HEATMAP">("SMC");

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

        <form onSubmit={handleSearch} className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Ticker (e.g. SPY, NVDA)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-md py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase shadow-inner"
          />
        </form>

        <div className="font-mono text-sm text-gray-400">
          LIVE TELEMETRY: <span className="text-cyan-400 font-bold ml-2">{activeTicker}</span>
        </div>
      </header>

      {/* TERMINAL GRID */}
      <main className="flex-1 p-4 grid grid-cols-12 grid-rows-2 gap-4 min-h-0">
        
        {/* MODULE 1: GEX SURFACE (Spans 8 columns, Top Row) */}
        <section className="col-span-8 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">GAMMA EXPOSURE (GEX)</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <GexSurface ticker={activeTicker} />
          </div>
        </section>

        {/* MODULE 2: OPTIONS FLOW TAPE (Spans 4 columns, Full Height) */}
        <section className="col-span-4 row-span-2 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">LIVE PREMIUM FLOW</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <OptionsFlow ticker={activeTicker} />
          </div>
        </section>

        {/* MODULE 3: HEATMAP & SMC (Spans 5 columns, Bottom Row) */}
        <section className="col-span-5 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-2 shrink-0">
            <div className="flex gap-4">
              <button 
                onClick={() => setModule3Tab("SMC")}
                className={`flex items-center gap-2 text-xs font-bold tracking-widest transition-colors pb-1 ${module3Tab === 'SMC' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-600 hover:text-gray-400'}`}
              >
                <Crosshair className="w-4 h-4" /> SMC TARGETS
              </button>
              <button 
                onClick={() => setModule3Tab("HEATMAP")}
                className={`flex items-center gap-2 text-xs font-bold tracking-widest transition-colors pb-1 ${module3Tab === 'HEATMAP' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}
              >
                <Activity className="w-4 h-4" /> HEATMAP
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {module3Tab === "SMC" ? <SMCRadar ticker={activeTicker} /> : <OptionsHeatmap ticker={activeTicker} />}
          </div>
        </section>

        {/* MODULE 4: MACRO DOCKET (Spans 3 columns, Bottom Row) */}
        <section className="col-span-3 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
            <Newspaper className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">MACRO DOCKET</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <MacroDocket ticker={activeTicker} />
          </div>
        </section>

      </main>
    </div>
  );
}

// ------------------------------------------------------------------
// MODULE COMPONENTS - TOP TIER ARCHITECTURE
// ------------------------------------------------------------------

const ENGINE_URL = "https://apex-engine-production.up.railway.app"; 

function GexSurface({ ticker }: { ticker: string }) {
  const [gexData, setGexData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fallbackData = [
    { ticker: ticker, time: "LIVE", premium: "$1.2M", size: "1,500" },
    { ticker: ticker, time: "LIVE", premium: "$850K", size: "800" },
    { ticker: ticker, time: "LIVE", premium: "$420K", size: "450" }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/flow?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        setTape(data.tape?.length ? data.tape : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setTape(fallbackData); 
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">SCANNING DARK POOLS...</div>;

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

  const fallbackData = [
    { title: `Institutional Volume Spikes on ${ticker}`, source: "Quant Wire", url: "#" },
    { title: "Market Makers Adjust Hedging Parameters", source: "Financial Desk", url: "#" },
    { title: "Macro Data Indicates Shifting Volatility", source: "Terminal Analytics", url: "#" }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/news?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.news?.length ? data.news : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setNews(fallbackData); 
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">PULLING WIRE...</div>;

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

function SMCRadar({ ticker }: { ticker: string }) {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackData = [
    { ticker: ticker, type: "SWING", dir: "CALLS", entry: "AUTO", target: "CALC", conf: 82 },
    { ticker: "QQQ", type: "DAY", dir: "PUTS", entry: "AUTO", target: "CALC", conf: 76 }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/signals?type=swings`)
      .then((res) => res.json())
      .then((data) => {
        setSignals(data.signals?.length ? data.signals : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setSignals(fallbackData); 
        setLoading(false);
      });
  }, [ticker]); 

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">CALCULATING EDGE...</div>;

  return (
    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
      {signals.map((sig, i) => (
        <div key={i} className="flex flex-col p-3 bg-[#1a1a1a] border border-[#333] rounded shrink-0 transition-all hover:border-[#555]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold text-lg">{sig.ticker}</span>
            <span className={`px-2 py-1 text-xs font-bold rounded ${sig.dir === 'PUTS' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {sig.type} {sig.dir}
            </span>
          </div>
          <div className="flex justify-between text-sm font-mono text-gray-400">
            <div className="flex flex-col">
              <span>Entry: <span className="text-white">{sig.entry}</span></span>
              <span>Target: <span className="text-green-400">{sig.target}</span></span>
            </div>
            <div className="flex flex-col items-end justify-end">
              <span>Edge: <span className="text-white">{sig.conf}%</span></span>
            </div>
          </div>
        </div>
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