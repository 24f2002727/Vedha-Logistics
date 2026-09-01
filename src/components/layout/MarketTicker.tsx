import React from 'react';
import { LIVE_MARKET_TICKER } from '../../data/freightRatesData';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  return (
    <div className="w-full bg-[#0F172A] border-b border-slate-800 text-xs py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Live Indicator */}
        <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap pr-4 border-r border-slate-800 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <Radio className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-slate-100">Live Baltic & Bunker Feed</span>
        </div>

        {/* Scrolling Indices Row */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5">
          {LIVE_MARKET_TICKER.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 shrink-0 bg-slate-800/80 hover:bg-slate-800 px-3 py-1 rounded-md border border-slate-700/60 transition-colors"
            >
              <span className="font-mono font-bold text-slate-200">{item.symbol}</span>
              <span className="text-slate-400 text-[11px] hidden md:inline">
                {item.name.split('(')[0].trim()}
              </span>
              <span className="font-mono font-bold text-white">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
              <span className={`flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                item.trend === 'up' 
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/60' 
                  : 'text-rose-300 bg-rose-950/80 border border-rose-800/60'
              }`}>
                {item.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {item.changePercent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
