"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AceAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "System initialized. I am Ace AI. How can I assist with your models today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Error connecting to quantitative matrix." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-[#222]">
      
      {/* CHAT HEADER */}
      <header className="h-16 border-b border-[#222] bg-[#111] flex items-center px-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Cpu className="text-purple-400 w-5 h-5" />
          <h1 className="font-mono font-bold text-lg tracking-widest text-white">ACE AI <span className="text-purple-500 text-xs ml-2 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded">OPUS ENGINE</span></h1>
        </div>
      </header>

      {/* MESSAGE HISTORY */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-md bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
            )}

            <div className={`max-w-[70%] p-4 rounded-md font-sans text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#222] border border-[#333] text-gray-200' 
                : 'bg-[#111] border border-purple-500/20 text-gray-300'
            }`}>
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-md bg-[#222] border border-[#333] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-md bg-purple-500/20 border border-purple-500/50 flex items-center justify-center animate-pulse">
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="p-4 font-mono text-xs text-purple-400 animate-pulse mt-2">
              PROCESSING TELEMETRY...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* INPUT AREA */}
      <footer className="p-4 bg-[#111] border-t border-[#222] shrink-0">
        <form onSubmit={sendMessage} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query Ace AI..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-md py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 rounded hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-purple-400" />
          </button>
        </form>
      </footer>
    </div>
  );
}