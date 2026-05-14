"use client";
import React, { useState } from 'react';
import { Trophy, Zap, Crosshair, Terminal, ShieldAlert, Cpu, Activity } from 'lucide-react';

const ENGINE_URL = "https://apex-engine-production.up.railway.app";

// Helper function to render Discord-style markdown in React
const formatMarkdown = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    // Bold text parsing
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

export default function SportsMatrix() {
  const [mode, setMode] = useState<"PREDICTOR" | "PARLAY">("PREDICTOR");
  const [sport, setSport] = useState("NBA");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [date, setDate] = useState("Today");
  const [market, setMarket] = useState("Moneyline, Spread, Total");
  const [legs, setLegs] = useState("3");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const getMarketOptions = () => {
    if (mode === "PREDICTOR") {
      return ["Moneyline, Spread, Total", "Moneyline Only", "Spreads Only", "Over/Under Totals"];
    } else {
      if (sport === "NBA") return ["PTS, REB, AST", "Threes & Steals", "First Quarter Props", "Any Player Prop"];
      if (sport === "NFL") return ["Pass Yds, Rush Yds, Rec", "Anytime TD Scorer", "Any Player Prop"];
      if (sport === "NHL") return ["Shots on Goal (SOG), Points", "Assists & Powerplay"];
      if (sport === "MLB") return ["Hits, Runs, RBIs", "Strikeouts, Total Bases"];
      if (sport === "SOC") return ["Shots on Target, Cards", "Goalscorers"];
      return ["Standard Player Props"];
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1 || !team2) return alert("Please enter both teams.");
    
    setLoading(true);
    setResult(null);

    const endpoint = mode === "PREDICTOR" 
      ? `${ENGINE_URL}/api/sports/predictor?team1=${team1}&team2=${team2}&sport=${sport}&date=${date}&market=${market}`
      : `${ENGINE_URL}/api/sports/parlays?league=${sport}&team1=${team1}&team2=${team2}&date=${date}&market=${market}&legs=${legs}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      
      setResult({
        type: mode,
        sport: sport,
        matchup: `${team1.toUpperCase()} vs ${team2.toUpperCase()}`,
        date: date,
        market: market,
        ai_text: data.result_text 
      });
      setLoading(false);

    } catch (err) {
      console.error(err);
      setResult({
        type: mode,
        matchup: `${team1.toUpperCase()} vs ${team2.toUpperCase()}`,
        ai_text: "❌ Neural link disrupted. Could not reach the Apex Engine."
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-[#222] bg-[#111] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-green-500/20 border border-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.2)]">
            <Trophy className="text-green-400 w-4 h-4" />
          </div>
          <span className="font-mono font-bold tracking-widest text-lg">ACE'S HOUSE | SPORTS MATRIX</span>
        </div>
        <div className="font-mono text-sm text-gray-400 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          POWERED BY: <span className="text-purple-400 font-bold">APEX OMNI-AGENT</span>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0">
        
        {/* LEFT COLUMN: THE INPUT TERMINAL */}
        <section className="col-span-4 bg-[#111] border border-[#222] rounded-md flex flex-col shadow-lg overflow-hidden">
          <div className="p-4 border-b border-[#222] bg-[#151515]">
            <h2 className="text-sm font-bold text-gray-300 tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" /> QUANTITATIVE PARAMETERS
            </h2>
          </div>
          
          <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest">OPERATION MODE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setMode("PREDICTOR")} className={`py-2 px-3 text-xs font-bold rounded border transition-colors ${mode === "PREDICTOR" ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#555]'}`}>
                    <Crosshair className="w-3 h-3 inline mr-1" /> GAME PREDICTOR
                  </button>
                  <button type="button" onClick={() => setMode("PARLAY")} className={`py-2 px-3 text-xs font-bold rounded border transition-colors ${mode === "PARLAY" ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#555]'}`}>
                    <Zap className="w-3 h-3 inline mr-1" /> GOD PARLAY
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest">TARGET SPORT</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono">
                  <option value="NBA">NBA (Basketball)</option>
                  <option value="NFL">NFL (Football)</option>
                  <option value="NHL">NHL (Hockey)</option>
                  <option value="MLB">MLB (Baseball)</option>
                  <option value="SOC">SOC (Soccer - EPL/UCL)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest">MATCHUP</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="e.g. SEA" value={team1} onChange={(e) => setTeam1(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono uppercase text-center" required />
                  <span className="text-xs font-bold text-gray-500">VS</span>
                  <input type="text" placeholder="e.g. VGK" value={team2} onChange={(e) => setTeam2(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono uppercase text-center" required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest">DATE</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono" required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest">MARKET TYPE</label>
                <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono">
                  {getMarketOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {mode === "PARLAY" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 tracking-widest">NUMBER OF LEGS</label>
                  <input type="number" min="2" max="6" value={legs} onChange={(e) => setLegs(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono" required />
                </div>
              )}

              <button type="submit" disabled={loading} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded uppercase tracking-widest transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <span className="animate-pulse">RUNNING L20 BACKTESTS...</span> : <>ENGAGE APEX OMNI-AGENT <Activity className="w-4 h-4" /></>}
              </button>

            </form>
          </div>
        </section>

        {/* RIGHT COLUMN: THE AI OUTPUT TERMINAL */}
        <section className="col-span-8 bg-[#111] border border-[#222] rounded-md flex flex-col shadow-lg overflow-hidden relative">
          
          <div className="p-4 border-b border-[#222] bg-[#151515] flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-300 tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> APEX MATRIX OUTPUT
            </h2>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
            {!loading && !result && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 font-mono text-sm opacity-50">
                <Trophy className="w-16 h-16 mb-4 text-gray-700" />
                <p>AWAITING QUANTITATIVE INPUT PARAMETERS...</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 font-mono text-sm">
                <Activity className="w-12 h-12 mb-4 animate-bounce" />
                <p className="animate-pulse mb-1">SCRAPING LIVE VEGAS ODDS...</p>
                <p className="animate-pulse text-xs text-green-700">Validating hit rates via Omni-Agent...</p>
              </div>
            )}

            {result && !loading && (
              <div className="animate-fade-in border border-[#333] bg-[#1a1a1a] rounded p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                
                <div className="flex justify-between items-start border-b border-[#333] pb-4 mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      {result.type === "PREDICTOR" ? <Crosshair className="text-cyan-400" /> : <Zap className="text-yellow-400" />}
                      ACE'S HOUSE: {result.type === "PREDICTOR" ? "GAME PREDICTOR" : "GOD PARLAY"}
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">Target: {result.matchup} | {result.date}</p>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold font-mono border ${result.type === "PREDICTOR" ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'}`}>
                    {result.market.toUpperCase()}
                  </div>
                </div>

                {/* THE PARSED ANTHROPIC TEXT */}
                <div className="font-mono text-sm text-gray-300 leading-relaxed mb-6">
                  {formatMarkdown(result.ai_text)}
                </div>

                <div className="mt-8 border-t border-[#333] pt-4">
                  <p className="text-xs text-gray-500 font-mono italic">
                    ⚠️ RISK DISCLOSURE: This is an algorithmic data map, not financial advice. Wagering carries extreme variance. Strictly manage your bankroll and tail at your own risk.
                  </p>
                </div>

              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}