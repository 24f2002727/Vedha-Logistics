import React from 'react';
import { Ship, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onRequestDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onRequestDemo }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
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
              Freight forecasting and charter optimization.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Operational</span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Platform
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => setActiveTab('intelligence')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Forecasting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('optimizer')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Vessel Solver
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('coa-planner')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Contracts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('maritime-map')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Route Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('congestion')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Congestion Radar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Ports & Origins */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Corridors
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-medium">
              <li>• Paradip</li>
              <li>• Visakhapatnam & Gangavaram</li>
              <li>• Dhamra & Sagar</li>
              <li>• Haldia</li>
              <li>• Australia</li>
              <li>• US East & Gulf Coast</li>
              <li>• Indonesia & Mozambique</li>
            </ul>
          </div>

          {/* Col 4: Enterprise Access */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Advisory
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Need custom modeling?
            </p>
            <button
              onClick={onRequestDemo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all cursor-pointer"
            >
              Request Model
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 Vedha Logistics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> BIMCO Compliant
            </span>
            <span>•</span>
            <span>Baltic Exchange</span>
            <span>•</span>
            <span>AI Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
