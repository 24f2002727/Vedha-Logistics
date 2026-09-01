import React, { useState } from 'react';
import { 
  Ship, 
  TrendingUp, 
  Layers, 
  Compass, 
  AlertTriangle, 
  FileText, 
  Menu, 
  X, 
  ChevronRight, 
  Anchor
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestDemo: () => void;
  onExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRequestDemo,
  onExportReport
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'intelligence', label: 'Freight Forecasting', icon: TrendingUp },
    { id: 'optimizer', label: 'Vessel Optimizer', icon: Ship },
    { id: 'coa-planner', label: 'Multi-Voyage COA', icon: Layers },
    { id: 'maritime-map', label: 'Trade Routes & Map', icon: Compass },
    { id: 'congestion', label: 'Port Congestion Radar', icon: AlertTriangle },
    { id: 'port-db', label: 'Port Constraints DB', icon: Anchor },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-200/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveTab('intelligence')}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 shadow-sm text-white font-black border border-slate-800">
              <Ship className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                  VEDHA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 uppercase tracking-wider">
                  NAUTICAL AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Maritime Freight & Charter Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Smaller refined font size) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-orange-600 bg-orange-50/90 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-orange-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onExportReport}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Brief</span>
            </button>

            <button
              onClick={onRequestDemo}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Book a Demo</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onExportReport();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Download Chartering Brief
            </button>
            <button
              onClick={() => {
                onRequestDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600"
            >
              Book a Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
