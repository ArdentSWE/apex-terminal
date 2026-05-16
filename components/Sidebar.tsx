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
    <aside className="w-20 lg:w-64 flex flex-col bg-[#03010a] border-r border-indigo-500/10 h-screen shrink-0 relative z-50">
      
      {/* BRAND LOGO */}
      <div className="flex items-center gap-4 p-6 mb-4 border-b border-white/5">
        <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <ShieldAlert className="text-indigo-400 w-5 h-5" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-white font-black tracking-widest text-sm font-mono">ACE'S HOUSE</h1>
          <p className="text-indigo-400/60 text-[10px] tracking-widest font-mono">QUANT MATRIX</p>
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
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
                  : 'text-gray-500 hover:text-indigo-300 hover:bg-white/[0.02] border border-transparent'
              }`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
                <span className="hidden lg:block font-mono text-xs font-bold uppercase tracking-wider">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER PING */}
      <div className="mt-auto p-6 hidden lg:block border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] text-gray-500 font-mono tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>
    </aside>
  );
}