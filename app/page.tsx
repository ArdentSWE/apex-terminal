"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, BarChart2, Zap, Globe, ShieldAlert, Search } from 'lucide-react';
import SMCScanner from '../components/SMCScanner';
import LiveChart from '../components/LiveChart';
import { DarkPoolTape, MacroDocket } from '../components/MacroFeed';

export default function ApexTerminal() {
  // 1. GLOBAL STATE: This controls the entire terminal
  const [activeTicker, setActiveTicker] = useState("NVDA");
  const [searchInput, setSearchInput] = useState("");

  // 2. THE SEARCH HANDLER: Triggers when you hit Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTicker(searchInput.toUpperCase().trim());
      setSearchInput(""); // Clear the bar after search
    }
  };

  return (
    <div className="flex h-screen bg-apex-bg text-white font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-16 flex flex-col items-center py-6 bg-apex-panel border-r border-apex-border">
        <div className="w-10 h-10 rounded bg-apex-cyan/20 flex items-center justify-center border border-apex-cyan mb-8 cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <Zap className="text-apex-cyan w-5 h-5" />
        </div>
        <nav className="flex flex-col gap-6">
          <Link href="/"><NavItem icon={<BarChart2 />} active /></Link>
          <Link href="/sports"><NavItem icon={<Activity />} /></Link>
          <NavItem icon={<Globe />} />
          <NavItem icon={<ShieldAlert />} />
        </nav>
      </aside>

      {/* MAIN TERMINAL GRID */}
      <main className="flex-1 p-2 flex flex-col gap-2 h-full overflow-hidden">
        
        {/* TOP HEADER & COMMAND CENTER */}
        <header className="h-14 bg-apex-panel border border-apex-border rounded-md flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-apex-cyan font-mono font-bold text-lg">ACE'S HOUSE</span>
            <span className="text-apex-muted text-sm tracking-widest hidden md:block">| QUANTITATIVE PIPELINE</span>
          </div>

          {/* THE SEARCH BAR */}
          <form onSubmit={handleSearch} className="flex items-center bg-apex-bg border border-apex-border rounded-md px-3 py-1.5 focus-within:border-apex-cyan transition-colors w-64">
            <Search className="w-4 h-4 text-apex-muted mr-2" />
            <input 
              type="text" 
              placeholder="Enter Ticker (e.g. SPY)..." 
              className="bg-transparent border-none outline-none text-sm font-mono text-white w-full uppercase placeholder:normal-case"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <div className="font-mono text-sm text-apex-muted flex gap-4">
            <span>SPY <span className="text-apex-green">+1.2%</span></span>
            <span>QQQ <span className="text-apex-green">+1.5%</span></span>
          </div>
        </header>

        {/* 3-PANE DATA MATRIX */}
        <div className="flex-1 flex gap-2 min-h-0">
          
          {/* LEFT PANE: SMC Radar */}
          <section className="w-1/4 bg-apex-panel border border-apex-border rounded-md flex flex-col p-4 overflow-hidden">
            <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0">SMC RADAR</h2>
            <SMCScanner />
          </section>

          {/* CENTER PANE: Live Charts */}
          <section className="w-2/4 bg-apex-panel border border-apex-border rounded-md flex flex-col p-4 overflow-hidden">
            <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0">
              LIVE TELEMETRY <span className="text-apex-cyan">({activeTicker})</span>
            </h2>
            <div className="flex-1 min-h-0 relative">
              {/* Pass the active ticker down into the chart component */}
              <LiveChart ticker={activeTicker} /> 
            </div>
          </section>

          {/* RIGHT PANE: Macro Feed & Tape */}
          <section className="w-1/4 flex flex-col gap-2 overflow-hidden">
            <div className="flex-1 bg-apex-panel border border-apex-border rounded-md p-4 flex flex-col min-h-0">
              <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0">DARK POOL TAPE</h2>
              <DarkPoolTape />
            </div>
            <div className="flex-1 bg-apex-panel border border-apex-border rounded-md p-4 flex flex-col min-h-0">
              <h2 className="text-sm font-bold text-apex-muted mb-4 tracking-wider border-b border-apex-border pb-2 shrink-0">MACRO DOCKET</h2>
              <MacroDocket ticker={activeTicker} />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// 3. BULLETPROOF NAV ITEM: Vertically stacked to prevent Next.js from throwing build errors
function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <div 
      className={`p-3 rounded-md cursor-pointer transition-colors ${
        active 
          ? 'bg-apex-border text-white' 
          : 'text-apex-muted hover:text-white hover:bg-apex-border/50'
      }`}
    >
      {icon}
    </div>
  );
}