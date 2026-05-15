"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Search, Activity, BarChart2, Layers, Newspaper, ArrowLeft, Target, ShieldAlert } from 'lucide-react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell, ResponsiveContainer } from 'recharts';

import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
const LiveChart = dynamic(() => import('@/components/LiveChart'), { ssr: false });
import WhaleTape from '@/components/WhaleTape';

const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app"; 

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('API Error');
  return res.json();
});

const formatMarkdown = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className={`mb-2 ${line.startsWith('-') ? 'pl-4 border-l-2 border-[#333] ml-2' : ''}`}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>;
          return part;
        })}
      </p>
    );
  });
};

export default function TickerDeepDive() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const rawTicker = params?.ticker as string || "";
  const ticker = rawTicker.toUpperCase();
  
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/${searchInput.toUpperCase().trim()}`);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center text-cyan-500 font-mono text-sm">
        <Activity className="w-12 h-12 mb-4 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none z-0" />

      <header className="h-auto lg:h-16 border-b border-white/5 bg-[#111]/80 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between p-4 lg:px-6 shrink-0 gap-4 lg:gap-0 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.2)]">
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
            className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-md py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase shadow-inner backdrop-blur-md placeholder-gray-600"
          />
        </form>

        <div className="font-mono text-sm flex flex-wrap items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-1 text-xs hover:text-white text-gray-400 transition-colors bg-[#222]/80 px-3 py-1 rounded border border-white/10">
            <ArrowLeft className="w-3 h-3" /> BACK TO GLOBAL (ESC)
          </button>
          <span className="text-gray-400 text-[10px] md:text-xs">TELEMETRY: <span className="text-cyan-400 font-bold ml-1">{ticker}</span></span>
        </div>
      </header>

      <div className="z-10 relative shrink-0 cursor-move">
        <WhaleTape />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <TickerDashboard ticker={ticker} />
      </div>
    </div>
  );
}

const TickerDashboard = React.memo(function TickerDashboard({ ticker }: { ticker: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const layout = [
    { i: "chart", x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
    { i: "gex", x: 0, y: 4, w: 8, h: 3, minW: 4, minH: 2 },
    { i: "flow", x: 8, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "thesis", x: 0, y: 7, w: 5, h: 3, minW: 4, minH: 2 },
    { i: "heatmap", x: 5, y: 7, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "docket", x: 9, y: 7, w: 3, h: 3, minW: 2, minH: 2 }
  ];

  if (!mounted) return null;

  return (
    <div className="p-2 lg:p-4 max-w-[1600px] mx-auto min-h-screen">
      <ResponsiveGridLayout className="layout" layouts={{ lg: layout }} breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} rowHeight={120} draggableHandle=".drag-handle" margin={[16, 16]}>
        <div key="chart" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 group-hover:bg-white/10 transition-colors z-10 relative">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest select-none">LIVE TELEMETRY - {ticker}</h2>
          </div>
          <div className="flex-1 p-0 overflow-hidden relative">
            <LiveChart ticker={ticker} />
          </div>
        </div>

        <div key="gex" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 group-hover:bg-white/10 transition-colors">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest select-none">GAMMA EXPOSURE (GEX) - {ticker}</h2>
          </div>
          <div className="flex-1 p-2 overflow-hidden">
            <GexSurface ticker={ticker} />
          </div>
        </div>

        <div key="flow" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 group-hover:bg-white/10 transition-colors">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest select-none">LIVE PREMIUM FLOW</h2>
          </div>
          <div className="flex-1 p-2 overflow-hidden">
            <OptionsFlow ticker={ticker} />
          </div>
        </div>

        <div key="thesis" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 group-hover:bg-white/10 transition-colors">
            <Target className="w-4 h-4 text-green-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest select-none">APEX AI THESIS</h2>
          </div>
          <div className="flex-1 p-3 overflow-hidden">
            <TickerAiThesis ticker={ticker} />
          </div>
        </div>

        <div key="heatmap" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 group-hover:bg-white/10 transition-colors">
            <Activity className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest select-none">OPTIONS MATRIX</h2>
          </div>
          <div className="flex-1 p-3 overflow-hidden">
            <OptionsHeatmap ticker={ticker} />
          </div>
        </div>

        <div key="docket" className="bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-md flex flex-col shadow-lg overflow-hidden group">
          <div className="drag-handle flex items-center gap-2 p-3 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing bg-white/5 group-hover:bg-white/10 transition-colors">
            <Newspaper className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest select-none">TICKER DOCKET</h2>
          </div>
          <div className="flex-1 p-3 overflow-hidden">
            <MacroDocket ticker={ticker} />
          </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
});

// Render-Isolated Sub-components
const TickerAiThesis = React.memo(function TickerAiThesis({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR(`${ENGINE_URL}/api/equities/ticker_idea?ticker=${ticker}`, fetcher);
  if (isLoading) return <div className="text-cyan-500 font-mono text-sm h-full flex items-center justify-center animate-pulse text-center px-4">GENERATING QUANT THESIS...</div>;
  if (!data || !data.idea) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center text-center px-4">INSUFFICIENT DATA TO GENERATE THESIS.</div>;
  const idea = data.idea;
  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-2 py-1 text-[10px] md:text-xs font-bold font-mono rounded border ${idea.play_type === 'DAY TRADE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>{idea.play_type}</span>
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
});

const GexSurface = React.memo(function GexSurface({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR(`${ENGINE_URL}/api/gex?ticker=${ticker}`, fetcher);
  if (isLoading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">CALCULATING GAMMA...</div>;
  if (!data || !data.data || data.data.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO GEX DATA.</div>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="strike" stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
        <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} width={40} />
        <Tooltip cursor={{ fill: '#222' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', fontFamily: 'monospace', fontSize: '10px' }} formatter={(value: any) => [`${value}`, 'Net Gamma']} />
        <ReferenceLine y={0} stroke="#444" />
        <Bar dataKey="gex" radius={[2, 2, 0, 0]}>
          {data.data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.gex > 0 ? '#00ffff' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

const OptionsFlow = React.memo(function OptionsFlow({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR(`${ENGINE_URL}/api/flow?ticker=${ticker}`, fetcher, { refreshInterval: 15000 });
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  if (isLoading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">SCANNING DARK POOLS...</div>;
  const tape = data?.tape || [];

  const filteredTape = tape.filter((trade: any) => {
    if (typeFilter !== 'ALL' && trade.ctype && trade.ctype !== typeFilter) return false;
    if (sizeFilter !== 'ALL') {
      const prem = trade.premium || "";
      if (sizeFilter === '1M+' && !prem.includes('M')) return false;
      if (sizeFilter === '500K+') {
         if (!prem.includes('M') && !prem.includes('K')) return false;
         if (prem.includes('K') && parseFloat(prem.replace(/[^0-9.]/g, '')) < 500) return false;
      }
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-white/5 shrink-0">
        <div className="flex bg-black rounded border border-white/10 overflow-hidden text-[10px] shadow-inner">
          <button onClick={() => setTypeFilter('ALL')} className={`px-3 py-1 ${typeFilter === 'ALL' ? 'bg-white/20 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}>ALL</button>
          <button onClick={() => setTypeFilter('C')} className={`px-3 py-1 ${typeFilter === 'C' ? 'bg-cyan-500/20 text-cyan-400 font-bold border-x border-cyan-500/30' : 'text-gray-500 hover:text-gray-300 border-x border-white/5'}`}>CALLS</button>
          <button onClick={() => setTypeFilter('P')} className={`px-3 py-1 ${typeFilter === 'P' ? 'bg-fuchsia-500/20 text-fuchsia-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}>PUTS</button>
        </div>
        <div className="flex bg-black rounded border border-white/10 overflow-hidden text-[10px] shadow-inner">
          <button onClick={() => setSizeFilter('ALL')} className={`px-3 py-1 ${sizeFilter === 'ALL' ? 'bg-white/20 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}>ALL SIZE</button>
          <button onClick={() => setSizeFilter('500K+')} className={`px-3 py-1 ${sizeFilter === '500K+' ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l border-yellow-500/30' : 'text-gray-500 hover:text-gray-300 border-l border-white/5'}`}>500K+</button>
          <button onClick={() => setSizeFilter('1M+')} className={`px-3 py-1 ${sizeFilter === '1M+' ? 'bg-green-500/20 text-green-400 font-bold border-l border-green-500/30' : 'text-gray-500 hover:text-gray-300 border-l border-white/5'}`}>1M+</button>
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-full">
        {filteredTape.length === 0 ? (
           <div className="text-gray-500 font-mono text-xs text-center py-4">NO FLOW MATCHES FILTERS.</div>
        ) : (
           filteredTape.map((trade: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#1a1a1a]/80 border border-white/5 hover:border-cyan-500/50 rounded text-sm font-mono shrink-0 transition-colors">
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-wider">{trade.ticker}</span>
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
});

const MacroDocket = React.memo(function MacroDocket({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR(`${ENGINE_URL}/api/news?ticker=${ticker}`, fetcher);
  if (isLoading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">PULLING WIRE...</div>;
  if (!data || !data.news || data.news.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO NEWS FOUND.</div>;
  return (
    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
      {data.news.map((item: any, i: number) => (
        <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block p-3 bg-[#1a1a1a]/80 border border-white/5 rounded hover:border-cyan-500/50 transition-all cursor-pointer shrink-0">
          <h3 className="text-[13px] md:text-sm text-gray-200 font-medium mb-1 line-clamp-2">{item.title}</h3>
          <p className="text-[10px] md:text-xs text-gray-500 font-mono">{item.source}</p>
        </a>
      ))}
    </div>
  );
});

const OptionsHeatmap = React.memo(function OptionsHeatmap({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR(`${ENGINE_URL}/api/heatmap?ticker=${ticker}`, fetcher);
  if (isLoading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">RENDERING MATRIX...</div>;
  if (!data || !data.data || data.data.length === 0) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center">NO MATRIX DATA FOUND.</div>;

  const getCellColor = (vol: number) => {
    if (vol > 500) return 'bg-cyan-400 text-black font-bold border border-cyan-300';
    if (vol > 200) return 'bg-cyan-500/60 text-white border border-cyan-500/50';
    if (vol > 100) return 'bg-cyan-500/30 text-gray-300 border border-white/5';
    if (vol > 0) return 'bg-[#1a1a1a]/80 text-gray-500 border border-white/5';
    return 'text-gray-700';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-mono text-[10px] md:text-xs">
      <div className="grid grid-cols-4 gap-1 mb-2 text-gray-400 font-bold text-center border-b border-white/10 pb-2 shrink-0">
        <div>STRIKE</div><div>NEAR</div><div>MID</div><div>FAR</div>
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
        {data.data.map((row: any, i: number) => (
          <div key={i} className="grid grid-cols-4 gap-1 text-center">
            <div className="flex items-center justify-center bg-[#222]/80 border border-white/5 rounded py-2 font-bold text-gray-200">${row.strike}</div>
            <div className={`flex items-center justify-center rounded py-2 ${getCellColor(row.exp1)}`}>{row.exp1 > 0 ? row.exp1 : '-'}</div>
            <div className={`flex items-center justify-center rounded py-2 ${getCellColor(row.exp2)}`}>{row.exp2 > 0 ? row.exp2 : '-'}</div>
            <div className={`flex items-center justify-center rounded py-2 ${getCellColor(row.exp3)}`}>{row.exp3 > 0 ? row.exp3 : '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
});