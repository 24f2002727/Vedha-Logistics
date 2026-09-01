import React from 'react';
import { Ship, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onRequestDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onRequestDemo }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Ship className="w-4 h-4" />
              </div>
              <span className="font-display tracking-tight">VEDHA NAUTICAL</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Predictive AI maritime freight forecasting and vessel chartering optimization for East Coast Indian ports and global bulk corridors.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All AI Forecasting Engines Operational</span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => setActiveTab('intelligence')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Predictive Baltic Freight Forecasting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('optimizer')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Vessel Selection & Draft Solver
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('coa-planner')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Multi-Voyage COA Transition Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('maritime-map')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Interactive Global Maritime Route Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('congestion')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Port Congestion & Demurrage Radar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Ports & Origins */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Monitored Corridors
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-medium">
              <li>• Paradip Port (Mechanized Coal / Ore)</li>
              <li>• Visakhapatnam & Gangavaram Deepwater</li>
              <li>• Dhamra Port & Sagar-Sandheads Lightering</li>
              <li>• Haldia Riverine Dock Complex</li>
              <li>• Australia (Hay Point, Newcastle, Gladstone)</li>
              <li>• US East & Gulf Coast (Norfolk, NOLA)</li>
              <li>• Indonesia (Taboneo, Samarinda) & Mozambique</li>
            </ul>
          </div>

          {/* Col 4: Enterprise Access */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Chartering Advisory
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Need custom algorithmic modeling for long-term contract of affreightment tenders?
            </p>
            <button
              onClick={onRequestDemo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all cursor-pointer"
            >
              Request Custom Model
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 Vedha Logistics Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> BIMCO Standard Compliant
            </span>
            <span>•</span>
            <span>Baltic Exchange Feed Integration</span>
            <span>•</span>
            <span>Maritime AI Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
