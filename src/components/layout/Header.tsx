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
  Anchor,
  Leaf,
  DollarSign,
  Home
} from 'lucide-react';
import { CurrencyType } from '../../types/maritime';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  onRequestDemo: () => void;
  onExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onRequestDemo,
  onExportReport
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'intelligence', label: 'Market Timing & Forecast', icon: TrendingUp },
    { id: 'optimizer', label: 'Vessel & Port Optimizer', icon: Ship },
    { id: 'coa-planner', label: 'Contract Strategy', icon: Layers },
    { id: 'virtual-arrival', label: 'Virtual Arrival & Green Steaming', icon: Leaf },
    { id: 'congestion', label: 'Port Congestion Radar', icon: AlertTriangle },
    { id: 'maritime-map', label: 'Sea Routes & Map', icon: Compass },
    { id: 'port-db', label: 'Port DB', icon: Anchor },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveTab('home')}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-950 shadow-md text-white font-black border border-slate-800">
              <Ship className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                  VEDHA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 uppercase tracking-wider">
                  LOGISTICS AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Maritime Freight &amp; Charter Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
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

          {/* Action CTAs + Currency Selector */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Currency Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  currency === 'INR' ? 'bg-white text-orange-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
            </div>

            <button
              onClick={onExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onRequestDemo}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Terminal View</span>
              <ChevronRight className="w-3 h-3 text-orange-400" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono font-bold">
              <button
                onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
                className="px-2 py-1 bg-white text-orange-600 rounded"
              >
                {currency}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
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
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
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
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
            >
              <FileText className="w-4 h-4" />
              <span>Export Optimization Report</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
