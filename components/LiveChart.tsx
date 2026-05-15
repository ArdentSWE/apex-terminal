'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function LiveChart({ ticker }: { ticker: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const ENGINE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://apex-engine-production.up.railway.app";

  useEffect(() => {
    if (!chartContainerRef.current) return;
    setLoading(true);

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#8b949e' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
      timeScale: { timeVisible: true, borderColor: 'rgba(255,255,255,0.1)' },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      crosshair: { mode: 1, vertLine: { color: '#06b6d4' }, horzLine: { color: '#06b6d4' } }
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22d3ee', downColor: '#f43f5e', borderVisible: false, wickUpColor: '#22d3ee', wickDownColor: '#f43f5e',
    });

    // 1. ROBUST RESIZE OBSERVER (Crucial for react-grid-layout dragging)
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width, height: newRect.height });
    });
    resizeObserver.observe(chartContainerRef.current);

    // 2. ROBUST DATA FETCHING & SCRUBBING
    fetch(`${ENGINE_URL}/api/chart?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => {
        // Extract array whether the backend wraps it in an object { chart: [...] } or just [...]
        let rawData = Array.isArray(data) ? data : (data.chart || data.data || []);
        
        if (rawData.length > 0) {
          const cleanData = rawData
            .map((d: any) => ({
               // Lightweight charts needs SECONDS. If backend sends MILLISECONDS, convert it.
               time: typeof d.time === 'number' && d.time > 9999999999 ? Math.floor(d.time / 1000) : d.time,
               open: d.open, high: d.high, low: d.low, close: d.close
            }))
            .sort((a: any, b: any) => a.time - b.time)
            // FATAL ERROR PREVENTION: Deduplicate exact timestamps
            .filter((item: any, pos: number, ary: any[]) => !pos || item.time !== ary[pos - 1].time);

          series.setData(cleanData);
          chart.timeScale().fitContent();
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Chart Error:", err);
        setLoading(false);
      });

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [ticker]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {loading && <div className="absolute z-10 text-cyan-500 animate-pulse font-mono text-xs tracking-widest bg-black/50 px-4 py-2 rounded backdrop-blur-sm border border-cyan-500/20">CALIBRATING CANDLES...</div>}
      <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}