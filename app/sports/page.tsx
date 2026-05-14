"use client";
import React, { useState, useEffect } from 'react';
import { Search, Trophy, Zap, Crosshair, Activity, Flame } from 'lucide-react';

export default function SportsMatrix() {
  const [activeLeague, setActiveLeague] = useState("NBA");
  const [team1, setTeam1] = useState("DEN");
  const [team2, setTeam2] = useState("MIN");

  const handleMatchupSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update matchup, you can expand this to split a string like "DEN vs MIN"
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* HEADER & LEAGUE SELECTOR */}
      <header className="h-16 border-b border-[#222] bg-[#111] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-green-500/20 border border-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.2)]">
            <Trophy className="text-green-400 w-4 h-4" />
          </div>
          <span className="font-mono font-bold tracking-widest text-lg">ACE'S HOUSE | SPORTS MATRIX</span>
        </div>

        <div className="flex bg-[#1a1a1a] rounded-md border border-[#333] p-1">
          {["NBA", "NFL", "NHL", "MLB"].map((league) => (
            <button
              key={league}
              onClick={() => setActiveLeague(league)}
              className={`px-4 py-1 text-xs font-bold font-mono rounded transition-colors ${activeLeague === league ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {league}
            </button>
          ))}
        </div>

        <div className="font-mono text-sm text-gray-400">
          ACTIVE MODEL: <span className="text-green-400 font-bold ml-2">{activeLeague} QUANT</span>
        </div>
      </header>

      {/* TERMINAL GRID */}
      <main className="flex-1 p-4 grid grid-cols-12 grid-rows-2 gap-4 min-h-0">
        
        {/* MODULE 1: GAME PREDICTOR (Spans 8 columns, Top Row) */}
        <section className="col-span-8 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0 justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-gray-400 tracking-widest">QUANTITATIVE MATCHUP PREDICTOR</h2>
            </div>
            <form onSubmit={handleMatchupSearch} className="flex gap-2">
              <input 
                type="text" 
                value={team1} 
                onChange={(e) => setTeam1(e.target.value.toUpperCase())}
                className="w-16 bg-[#1a1a1a] border border-[#333] rounded text-center font-mono text-xs focus:border-green-500 focus:outline-none uppercase"
              />
              <span className="text-gray-500 font-mono text-xs flex items-center">VS</span>
              <input 
                type="text" 
                value={team2} 
                onChange={(e) => setTeam2(e.target.value.toUpperCase())}
                className="w-16 bg-[#1a1a1a] border border-[#333] rounded text-center font-mono text-xs focus:border-green-500 focus:outline-none uppercase"
              />
            </form>
          </div>
          <div className="flex-1 overflow-hidden">
            <GamePredictor team1={team1} team2={team2} league={activeLeague} />
          </div>
        </section>

        {/* MODULE 2: AI PARLAY CREATOR (Spans 4 columns, Full Height) */}
        <section className="col-span-4 row-span-2 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">HIGH-CONFIDENCE PARLAYS</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ParlayMatrix league={activeLeague} />
          </div>
        </section>

        {/* MODULE 3: ARBITRAGE & POSITIVE EV SCANNER (Spans 8 columns, Bottom Row) */}
        <section className="col-span-8 row-span-1 bg-[#111] border border-[#222] rounded-md p-4 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-[#222] pb-2 shrink-0">
            <Flame className="w-4 h-4 text-red-400" />
            <h2 className="text-xs font-bold text-gray-400 tracking-widest">+EV PROP SCANNER</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <EvScanner league={activeLeague} />
          </div>
        </section>

      </main>
    </div>
  );
}

// ------------------------------------------------------------------
// MODULE COMPONENTS - SPORTS ARCHITECTURE
// ------------------------------------------------------------------

const ENGINE_URL = "https://apex-engine-production.up.railway.app";

function GamePredictor({ team1, team2, league }: { team1: string, team2: string, league: string }) {
  const [matchupData, setMatchupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fallbackData = {
    team1: team1,
    team2: team2,
    t1WinProb: 68,
    t2WinProb: 32,
    projectedTotal: 212.5,
    edge: "T1 ML (-145)",
    keyFactor: "Significant rebounding mismatch; T2 missing starting Center."
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/sports/predictor?team1=${team1}&team2=${team2}`)
      .then((res) => res.json())
      .then((data) => {
        setMatchupData(data.matchup ? data : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setMatchupData(fallbackData);
        setLoading(false);
      });
  }, [team1, team2, league]);

  if (loading || !matchupData) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">RUNNING SIMULATIONS...</div>;

  return (
    <div className="flex flex-col h-full justify-center px-8">
      <div className="flex justify-between items-end mb-2 font-mono">
        <span className="text-3xl font-bold text-white">{matchupData.team1}</span>
        <span className="text-gray-500 font-bold mb-1">WIN PROBABILITY</span>
        <span className="text-3xl font-bold text-white">{matchupData.team2}</span>
      </div>
      
      {/* Probability Bar */}
      <div className="w-full h-8 flex rounded overflow-hidden border border-[#333] shadow-inner mb-6">
        <div 
          className="h-full bg-cyan-500/80 flex items-center pl-4 font-bold text-black"
          style={{ width: `${matchupData.t1WinProb}%` }}
        >
          {matchupData.t1WinProb}%
        </div>
        <div 
          className="h-full bg-[#222] flex items-center justify-end pr-4 font-bold text-gray-400"
          style={{ width: `${matchupData.t2WinProb}%` }}
        >
          {matchupData.t2WinProb}%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 font-mono text-sm text-center">
        <div className="bg-[#1a1a1a] p-3 rounded border border-[#333]">
          <div className="text-gray-500 text-xs mb-1">PROJ TOTAL</div>
          <div className="text-white font-bold">{matchupData.projectedTotal}</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded border border-[#333] shadow-[0_0_8px_rgba(0,255,0,0.1)] border-green-500/30">
          <div className="text-green-400 text-xs mb-1">ALGO EDGE</div>
          <div className="text-white font-bold">{matchupData.edge}</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded border border-[#333]">
          <div className="text-gray-500 text-xs mb-1">KEY FACTOR</div>
          <div className="text-gray-300 text-xs line-clamp-2">{matchupData.keyFactor}</div>
        </div>
      </div>
    </div>
  );
}

function ParlayMatrix({ league }: { league: string }) {
  const [parlays, setParlays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackData = [
    { 
      name: "HEAVY FAVORITE MODEL", odds: "+145", ev: "+4.2%", status: "PLAYABLE",
      legs: ["DEN Moneyline", "Jokic Over 24.5 PTS", "Murray Over 5.5 AST"] 
    },
    { 
      name: "HIGH VARIANCE LOTO", odds: "+850", ev: "+1.8%", status: "FRACTIONAL",
      legs: ["MIN +4.5", "Edwards Over 28.5 PTS", "Gobert Under 11.5 REB"] 
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${ENGINE_URL}/api/sports/parlays?league=${league}`)
      .then((res) => res.json())
      .then((data) => {
        setParlays(data.parlays?.length ? data.parlays : fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setParlays(fallbackData);
        setLoading(false);
      });
  }, [league]);

  if (loading) return <div className="text-gray-500 font-mono text-sm h-full flex items-center justify-center animate-pulse">GENERATING PARLAYS...</div>;

  return (
    <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 h-full">
      {parlays.map((parlay, i) => (
        <div key={i} className="flex flex-col p-3 bg-[#1a1a1a] border border-[#333] hover:border-yellow-500/50 rounded shrink-0 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-bold text-sm tracking-wider">{parlay.name}</span>
            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 text-xs font-bold rounded">
              {parlay.odds}
            </span>
          </div>
          
          <div className="flex flex-col gap-1 mb-3">
            {parlay.legs.map((leg: string, idx: number) => (
              <div key={idx} className="text-xs font-mono text-gray-300 flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-500 rounded-full" /> {leg}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-[#333] pt-2 text-xs font-mono">
            <span className="text-gray-500">EV: <span className="text-green-400 font-bold">{parlay.ev}</span></span>
            <span className={parlay.status === 'PLAYABLE' ? 'text-green-400' : 'text-orange-400'}>{parlay.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EvScanner({ league }: { league: string }) {
  // Simulating a live scanner of positive Expected Value props
  const props = [
    { player: "L. DONCIC", market: "AST", line: "8.5", side: "OVER", odds: "+110", trueOdds: "-105", edge: "3.4%" },
    { player: "J. TATUM", market: "REB", line: "9.5", side: "UNDER", odds: "-115", trueOdds: "-130", edge: "2.1%" },
    { player: "S. GILGEOUS", market: "PTS", line: "31.5", side: "OVER", odds: "-105", trueOdds: "-120", edge: "2.8%" }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden font-mono text-xs">
      <div className="grid grid-cols-7 gap-1 mb-2 text-gray-400 font-bold text-center border-b border-[#333] pb-2 shrink-0">
        <div className="col-span-2 text-left pl-2">PLAYER</div>
        <div>MARKET</div>
        <div>LINE</div>
        <div>ODDS</div>
        <div>TRUE OD</div>
        <div className="text-green-400">EDGE</div>
      </div>
      
      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
        {props.map((prop, i) => (
          <div key={i} className="grid grid-cols-7 gap-1 text-center items-center bg-[#1a1a1a] border border-[#333] rounded py-2 hover:bg-[#222] transition-colors">
            <div className="col-span-2 text-left pl-2 text-white font-bold">{prop.player}</div>
            <div className="text-gray-300">{prop.market}</div>
            <div className="font-bold text-cyan-400">{prop.side} {prop.line}</div>
            <div className="text-gray-400">{prop.odds}</div>
            <div className="text-gray-500">{prop.trueOdds}</div>
            <div className="text-green-400 font-bold bg-green-500/10 py-1 rounded mx-1">{prop.edge}</div>
          </div>
        ))}
      </div>
    </div>
  );
}