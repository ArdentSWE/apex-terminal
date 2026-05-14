"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function LiveChart({ ticker }: { ticker: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    setLoading(true);

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8b949e',
      },
      grid: {
        vertLines: { color: '#30363d', style: 1 },
        horzLines: { color: '#30363d', style: 1 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#30363d',
      },
      rightPriceScale: {
        borderColor: '#30363d',
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#8b949e', labelBackgroundColor: '#161b22' },
        horzLine: { color: '#8b949e', labelBackgroundColor: '#161b22' },
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#2ecc71',
      downColor: '#FF003F',
      borderVisible: false,
      wickUpColor: '#2ecc71',
      wickDownColor: '#FF003F',
    });

    // 🚀 UPDATED: Pointing to the live Railway Cloud URL
    fetch(`https://apex-engine-production.up.railway.app/api/chart?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
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
        <div className="absolute inset-0 flex items-center justify-center text-apex-cyan animate-pulse font-mono text-sm z-10 bg-apex-panel/80">
          PULLING TELEMETRY FOR {ticker}...
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}