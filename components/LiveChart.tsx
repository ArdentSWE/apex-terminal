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

    // Initialize the TradingView Chart with custom Matrix aesthetics
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8b949e',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)', style: 1 },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)', style: 1 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#cyan-500', labelBackgroundColor: '#0a0a0a' },
        horzLine: { color: '#cyan-500', labelBackgroundColor: '#0a0a0a' },
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22d3ee', // Cyan-400
      downColor: '#f43f5e', // Rose-500
      borderVisible: false,
      wickUpColor: '#22d3ee',
      wickDownColor: '#f43f5e',
    });

    // Fetch the live chart data from your engine
    fetch(`${ENGINE_URL}/api/chart?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const sortedData = data.sort((a: any, b: any) => a.time - b.time);
          candlestickSeries.setData(sortedData);
          chart.timeScale().fitContent();
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Chart fetch error:", err);
        setLoading(false);
      });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker]);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-cyan-500 animate-pulse font-mono text-sm z-10 bg-black/50 backdrop-blur-sm">
          PULLING TELEMETRY FOR {ticker}...
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}