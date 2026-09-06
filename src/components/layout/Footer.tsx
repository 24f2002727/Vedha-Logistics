import React from 'react';
import { Ship, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
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
              <span className="font-display tracking-tight">VEDHA LOGISTICS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-driven freight rate forecasting, vessel nomination solver, and idle time mitigation for Indian East Coast bulk procurement.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All 4 Problem Engines Operational</span>
            </div>
          </div>

          {/* Col 2: Problem Modules */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Core Problem Solutions
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => setActiveTab('market-timing')} className="hover:text-orange-400 transition-colors cursor-pointer text-left">
                  a. Optimal Market Entry Timing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vessel-optimizer')} className="hover:text-orange-400 transition-colors cursor-pointer text-left">
                  b. Vessel Type Optimization
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('idle-management')} className="hover:text-orange-400 transition-colors cursor-pointer text-left">
                  c. Idle Scenario Management
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('risk-mitigation')} className="hover:text-orange-400 transition-colors cursor-pointer text-left">
                  d. Risk Mitigation Radar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Ports & Origins */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Corridor Constraints
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-medium">
              <li>• Paradip & Dhamra (Deep Draft)</li>
              <li>• Visakhapatnam & Gangavaram</li>
              <li>• Haldia & Sagar (Riverine STS)</li>
              <li>• Gopalpur Port</li>
              <li>• Australia (Hay Point / DBCT / Gladstone)</li>
              <li>• US East Coast & Indonesia</li>
            </ul>
          </div>

          {/* Col 4: Key Capabilities */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-3">
              Decision Intelligence
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Built to minimize landed freight costs, eliminate demurrage at congested berths, and prevent empty ballast positioning.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 Vedha Logistics AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> BIMCO Compliant
            </span>
            <span>•</span>
            <span>Baltic Exchange Indices</span>
            <span>•</span>
            <span>IMO CII Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
