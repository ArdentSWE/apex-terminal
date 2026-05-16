"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Lightbulb, Search, Trophy, ShieldAlert } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Terminal", icon: LayoutDashboard, path: "/" },
    { name: "Trade Ideas", icon: Lightbulb, path: "/ideas" },
    { name: "Scanner", icon: Search, path: "/search" },
    { name: "Sports", icon: Trophy, path: "/sports" }
  ];

  return (
    <aside className="w-20 lg:w-64 flex flex-col bg-[#090014] border-r border-purple-500/20 h-screen shrink-0 relative z-50 shadow-[5px_0_30px_rgba(168,85,247,0.05)]">
      
      {/* BRAND LOGO */}
      <div className="flex items-center gap-4 p-6 mb-4 border-b border-purple-500/10">
        <div className="w-10 h-10 rounded bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
          <ShieldAlert className="text-fuchsia-400 w-5 h-5" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-white font-black tracking-widest text-sm font-mono">ACE'S HOUSE</h1>
          <p className="text-fuchsia-400/60 text-[10px] tracking-widest font-mono shadow-fuchsia-500">QUANT MATRIX</p>
        </div>
      </div>

      {/* NAVIGATION PILLARS */}
      <nav className="flex flex-col gap-2 w-full px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-4 group ${
                isActive 
                  ? 'bg-purple-900/30 text-fuchsia-400 border border-fuchsia-500/40 shadow-[inset_0_0_20px_rgba(217,70,239,0.1)]' 
                  : 'text-purple-300/60 hover:text-fuchsia-300 hover:bg-purple-900/10 border border-transparent'
              }`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]' : 'group-hover:text-fuchsia-400 transition-colors'}`} />
                <span className="hidden lg:block font-mono text-xs font-bold uppercase tracking-wider">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER PING */}
      <div className="mt-auto p-6 hidden lg:block border-t border-purple-500/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
          <span className="text-[10px] text-purple-400/50 font-mono tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>
    </aside>
  );
}