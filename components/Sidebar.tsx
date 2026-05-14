"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Trophy, MessageSquare, Zap } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 flex flex-col items-center py-6 bg-[#111] border-r border-[#222] shrink-0">
      
      {/* BRAND LOGO */}
      <div className="w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center border border-cyan-500 mb-8 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
        <Zap className="text-cyan-400 w-5 h-5" />
      </div>

      {/* THE 3 PILLARS */}
      <nav className="flex flex-col gap-6 w-full px-2">
        
        {/* TAB 1: EQUITIES */}
        <Link href="/">
          <div className={`p-3 rounded-md cursor-pointer transition-all flex justify-center ${pathname === '/' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-gray-500 hover:text-white hover:bg-[#222]'}`}>
            <BarChart2 className="w-5 h-5" />
          </div>
        </Link>

        {/* TAB 2: SPORTS */}
        <Link href="/sports">
          <div className={`p-3 rounded-md cursor-pointer transition-all flex justify-center ${pathname === '/sports' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'text-gray-500 hover:text-white hover:bg-[#222]'}`}>
            <Trophy className="w-5 h-5" />
          </div>
        </Link>

        {/* TAB 3: AI CHATBOT */}
        <Link href="/chat">
          <div className={`p-3 rounded-md cursor-pointer transition-all flex justify-center ${pathname === '/chat' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'text-gray-500 hover:text-white hover:bg-[#222]'}`}>
            <MessageSquare className="w-5 h-5" />
          </div>
        </Link>

      </nav>
    </aside>
  );
}