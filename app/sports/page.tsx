"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, BarChart2, Zap, Globe, ShieldAlert, Trophy, Target, AlertTriangle, TrendingUp, Crosshair } from 'lucide-react';

export default function SportsMatrix() {
  const [activeLeague, setActiveLeague] = useState("NBA");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FETCH QUANT DATA WHEN LEAGUE CHANGES
  useEffect(() => {
    setLoading(true);
    // 🚀 UPDATED: Pointing to the live Railway Cloud URL
    fetch(`https://apex-engine-production.up.railway.app/api/sports?league=${activeLeague}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => console.error("Sports fetch error:", err));
  }, [activeLeague]);

  return (
    <div className="flex h-screen bg-apex-bg text-white font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-16 flex flex-col items-center py-6 bg-apex-panel border-r border-apex-border">
        <div className="w-10 h-10 rounded bg-apex-cyan/20 flex items-center justify-center border border-apex-cyan mb-8 cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <Zap className="text-apex-cyan w-5 h-5" />
        </div>
        <nav className="flex flex-col gap-6">
          <Link href="/"><NavItem icon={<BarChart2 />} /></Link>
          <Link href="/sports"><NavItem icon={<Activity />} active /></Link>
          <NavItem icon={<Globe />} />
          <NavItem icon={<ShieldAlert />} />
        </nav>
      </aside>

      {/* SPORTS MATRIX MAIN GRID */}
      <main className="flex-1 p-2 flex flex-col gap-2 h-full overflow-hidden">
        
        <header className="h-14 bg-apex-panel border border-apex-border rounded-md flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Trophy className="text-apex-gold w-5 h-5" />
            <span className="text-apex-gold font-mono font-bold text-lg">THE GOD PARLAYS</span>
            <span className="text-apex-muted text-sm tracking-widest hidden md:block">| QUANTITATIVE ODDS</span>
          </div>

          <div className="flex gap-2 bg-apex-bg p-1 border border-apex-border rounded-md font-mono text-sm">
            {["NBA", "NHL", "EPL"].map((league) => (
              <button 
                key={league}
                onClick={() => setActiveLeague(league)}
                className={`px-4 py-1 rounded transition-colors ${activeLeague === league ? 'bg-apex-gold text-black font-bold' : 'text-apex-muted hover:text-white'}`}
              >
                {league}
              </button>
            ))}
          </div>

          <div className="font-mono text-sm flex gap-4">
            <span className="text-apex-muted">SYS EDGE: <span className="text-apex-green">+8.4%</span></span>
            <span className="text-apex-muted">ROI (30D): <span className="text-apex-green">+14.2u</span></span>
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-apex-gold font-mono animate-pulse">
            CALCULATING {activeLeague} PROBABILITIES...
          </div>
        ) : (
          <div className="flex-1 flex gap-2 min-h-0">
            
            {/* LEFT PANE: Parlays */}
            <section className="w-1/3 bg-apex-panel border border-apex-border rounded-md flex flex-col p-4 overflow-hidden">
              <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0 flex items-center gap-2">
                <Target className="w-4 h-4 text-apex-cyan" /> HIGH-CONFIDENCE SLIPS
              </h2>
              <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {data?.parlays.map((parlay: any, i: number) => (
                  <div key={i} className={`bg-apex-bg border border-apex-border rounded p-3 flex flex-col gap-2 relative overflow-hidden transition-colors`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${parlay.color}`} />
                    <div className="flex justify-between items-center pl-2">
                      <span className="font-bold font-mono text-sm">{parlay.name}</span>
                      <span className={`font-mono text-xs px-2 py-1 rounded bg-opacity-10 text-white ${parlay.color}`}>{parlay.odds}</span>
                    </div>
                    <ul className="text-xs text-apex-muted font-mono pl-2 space-y-1 mt-1">
                      {parlay.legs.map((leg: any, j: number) => (
                        <li key={j} className="flex justify-between"><span>{leg.prop}</span><span className="text-apex-cyan">{leg.prob}</span></li>
                      ))}
                    </ul>
                    <div className="mt-2 pl-2 flex items-center justify-between text-[10px] text-apex-muted">
                      <span>EV: {parlay.ev}</span>
                      <span className="text-apex-green">{parlay.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CENTER PANE: +EV Props */}
            <section className="w-1/3 bg-apex-panel border border-apex-border rounded-md flex flex-col p-4 overflow-hidden">
              <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-apex-green" /> LIVE +EV PROP SCANNER
              </h2>
              <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-center text-xs text-apex-muted mb-2 px-2">
                  <span>PLAYER PROP</span><span>EDGE</span>
                </div>
                {data?.props.map((prop: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-apex-bg border border-apex-border rounded p-2 text-xs font-mono hover:border-apex-green transition-colors cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{prop.name}</span>
                      <span className="text-apex-muted">{prop.prop} <span className="text-white">({prop.odds})</span></span>
                    </div>
                    <span className="text-apex-green bg-apex-green/10 px-2 py-1 rounded">{prop.edge}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT PANE: Injury & Shifts */}
            <section className="w-1/3 flex flex-col gap-2 overflow-hidden">
              <div className="flex-1 bg-apex-panel border border-apex-border rounded-md p-4 flex flex-col min-h-0">
                <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-apex-red" /> INJURY IMPACT RADAR
                </h2>
                <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                  {data?.injuries.map((inj: any, i: number) => (
                    <div key={i} className={`border-l-2 pl-2 ${inj.color}`}>
                      <span className="text-sm font-bold text-white block">{inj.player} - {inj.status}</span>
                      <span className="text-xs text-apex-muted leading-tight">{inj.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-apex-panel border border-apex-border rounded-md p-4 flex flex-col min-h-0">
                <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-apex-cyan" /> SHARP MONEY SHIFTS
                </h2>
                <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar text-xs font-mono">
                  {data?.shifts.map((shift: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b border-apex-border pb-2">
                      <span className="text-apex-muted">{shift.match}</span>
                      <span className={shift.color}>{shift.shift}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <div className={`p-3 rounded-md cursor-pointer transition-colors ${active ? 'bg-apex-gold text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'text-apex-muted hover:text-white hover:bg-apex-border/50'}`}>
      {icon}
    </div>
  );
}