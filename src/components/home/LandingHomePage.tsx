import React, { useState } from 'react';
import {
  Ship,
  TrendingUp,
  Layers,
  Leaf,
  AlertTriangle,
  Compass,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Anchor,
  MapPin,
  Zap,
  Clock,
  Activity,
  DollarSign,
  Fuel,
  Globe2,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { VESSEL_CLASSES } from '../../data/vesselData';
import { CurrencyType } from '../../types/maritime';
import { formatCurrency, formatRatePerMT } from '../../utils/currencyUtils';
import { WorldMapHeroBackground } from './WorldMapHeroBackground';

interface LandingHomePageProps {
  onNavigateTab: (tabId: string) => void;
  onQuickSimulate: (originId: string, destId: string, volume: number) => void;
  currency?: CurrencyType;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  onNavigateTab,
  onQuickSimulate,
  currency = 'USD'
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState('au-hay');
  const [selectedDest, setSelectedDest] = useState('in-par');
  const [cargoVolume, setCargoVolume] = useState<number>(75000);
  const [commodity, setCommodity] = useState('Coking Coal');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSimulate(selectedOrigin, selectedDest, cargoVolume);
  };

  const solutions = [
    {
      id: 'intelligence',
      icon: TrendingUp,
      title: 'Market Entry Timing',
      tagline: 'Freight Forecasting',
      description: '180-day forward curves across Baltic indices to identify optimal charter windows.',
      badge: 'ML Ensemble v4.2',
      badgeColor: 'text-orange-600 bg-orange-50 border-orange-200',
      actionText: 'Explore Forecast Curves'
    },
    {
      id: 'optimizer',
      icon: Ship,
      title: 'Vessel & Draft Solver',
      tagline: 'Constraint Matching',
      description: 'Match parcel sizes with East Coast India draft, LOA, and STS lighterage rules.',
      badge: 'UKC Draft Engine',
      badgeColor: 'text-sky-600 bg-sky-50 border-sky-200',
      actionText: 'Run Vessel Solver'
    },
    {
      id: 'coa-planner',
      icon: Layers,
      title: 'Contract Strategy',
      tagline: 'Portfolio Allocation',
      description: 'Transition from spot fixtures to structured COA programs with risk reduction.',
      badge: 'MILP Solver',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      actionText: 'Model Contract Strategy'
    },
    {
      id: 'virtual-arrival',
      icon: Leaf,
      title: 'Virtual Arrival',
      tagline: 'Idle Time Reduction',
      description: 'Optimize speed to reduce fuel consumption, eliminate demurrage, and improve CII ratings.',
      badge: 'JIT Eco-Steaming',
      badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
      actionText: 'Simulate Virtual Arrival'
    },
    {
      id: 'congestion',
      icon: AlertTriangle,
      title: 'Congestion Radar',
      tagline: 'Live Disruption Feed',
      description: 'Monitor real-time waiting times and simulate risks on freight turnaround.',
      badge: 'Live Telemetry',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      actionText: 'View Congestion Radar'
    },
    {
      id: 'maritime-map',
      icon: Compass,
      title: 'Global Sea Routes',
      tagline: 'Trade Lanes',
      description: 'Visualize global bulk flows to East Coast India discharge hubs.',
      badge: 'Interactive GIS',
      badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      actionText: 'Open World Map'
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-300">

      {/* 1. Hero Section with Interactive World Map Background */}
      <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-center">

        {/* World Maritime Sea Routes Vector Map Background */}
        <WorldMapHeroBackground />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Intelligent Freight &amp; Charter Optimization
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Empowering procurement teams with predictive freight forecasting, port draft solvers, and risk-managed contract strategies.
          </p>
        </div>

        {/* Hero Interactive Quick Feasibility & Freight Rate Bar */}
        <div className="relative z-10 mt-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-6 border border-slate-200/80 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Route &amp; Rate Estimator
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              India East Coast Verified
            </span>
          </div>

          <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origin Port */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Origin Load Port
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
              >
                {GLOBAL_ORIGIN_PORTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
                ))}
              </select>
            </div>

            {/* Destination Port */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-sky-600" /> East Coast Discharge Port
              </label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white transition-colors cursor-pointer"
              >
                {EAST_COAST_INDIAN_PORTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Draft: {p.maxDraft}m)</option>
                ))}
              </select>
            </div>

            {/* Parcel Size */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" /> Parcel Volume (MT)
              </label>
              <select
                value={cargoVolume}
                onChange={(e) => setCargoVolume(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-600 focus:bg-white transition-colors cursor-pointer"
              >
                <option value={35000}>35,000 MT (Handysize)</option>
                <option value={55000}>55,000 MT (Supramax)</option>
                <option value={63500}>63,500 MT (Ultramax)</option>
                <option value={75000}>75,000 MT (Panamax)</option>
                <option value={82000}>82,000 MT (Kamsarmax)</option>
                <option value={150000}>150,000 MT (Capesize)</option>
                <option value={180000}>180,000 MT (Capesize Deep)</option>
              </select>
            </div>

            {/* Submit Action */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 cursor-pointer group"
              >
                <span>Analyze Route</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Key Operational Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Annual Volume Solved</span>
          <div className="text-2xl font-bold font-mono text-slate-900">14.8M MT</div>
          <span className="text-xs text-slate-500">Coking coal &amp; bulk minerals</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Average Landed Savings</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">13.5% Lower</div>
          <span className="text-xs text-slate-500">vs unhedged spot volatility</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Port Network Coverage</span>
          <div className="text-2xl font-bold font-mono text-cyan-700">18 Global Hubs</div>
          <span className="text-xs text-slate-500">East Coast India + global origins</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Scope 1 CO2 Abatement</span>
          <div className="text-2xl font-bold font-mono text-teal-700">85,000+ MT</div>
          <span className="text-xs text-slate-500">Via Virtual Arrival eco-steaming</span>
        </div>
      </div>

      {/* 3. Core Logistics Solutions Grid (Click to Jump Directly) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">
              Core Logistics Solutions
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Decision-support suite for rate forecasting, vessel nomination, contracts, green steaming, and risk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => onNavigateTab(sol.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-orange-50 text-slate-700 group-hover:text-orange-600 transition-colors border border-slate-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${sol.badgeColor}`}>
                      {sol.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                      {sol.tagline}
                    </span>
                    <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {sol.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {sol.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                  <span>{sol.actionText}</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. India East Coast Port Network Infrastructure Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Anchor className="w-5 h-5 text-sky-600" />
              <span>East Coast India Ports Network</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Physical parameters and discharge capabilities across all major terminals.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('port-db')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 font-mono hover:underline self-start sm:self-auto cursor-pointer"
          >
            View Complete Port Database &rarr;
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {EAST_COAST_INDIAN_PORTS.map((port) => (
            <div
              key={port.id}
              className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)] p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="space-y-2 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-sans">{port.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
                    {port.code}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Draft:</span>
                    <span className="font-bold text-slate-800">{port.maxDraft}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max LOA:</span>
                    <span className="font-bold text-slate-800">{port.maxLOA}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Turnaround:</span>
                    <span className="font-bold text-emerald-700">{port.avgWaitingDays}d Avg Queue</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Handling Rate:</span>
                    <span className="font-bold text-slate-800">{(port.cargoHandlingRateTPD / 1000).toFixed(0)}k TPD</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight pt-1 border-t border-slate-200/60 line-clamp-2">
                  {port.infrastructureNotes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 4-Step Systematic Logistics Optimization Workflow */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block mb-1">
            End-to-End Decision Framework
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Optimizing Your Bulk Procurement
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 hover:bg-slate-700/80 hover:-translate-y-1 transition-all duration-300">
            <span className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 font-mono font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h4 className="text-sm font-bold text-white">Trade Corridor &amp; Intake</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define load port, discharge destination, volume, and timeline.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 hover:bg-slate-700/80 hover:-translate-y-1 transition-all duration-300">
            <span className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 font-mono font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h4 className="text-sm font-bold text-white">Draft &amp; Physical Solver</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluate UKC, LOA, crane capability, and STS requirements.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 hover:bg-slate-700/80 hover:-translate-y-1 transition-all duration-300">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <h4 className="text-sm font-bold text-white">AI Market Timing Radar</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze forward curves to execute spot fixtures or lock COAs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 hover:bg-slate-700/80 hover:-translate-y-1 transition-all duration-300">
            <span className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 font-mono font-bold text-xs flex items-center justify-center">
              04
            </span>
            <h4 className="text-sm font-bold text-white">Virtual Arrival &amp; Execution</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Activate JIT speed reduction to eliminate demurrage and generate term sheets.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Ready to Optimize Bottom Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-display font-extrabold tracking-tight">
            Ready to optimize freight chartering?
          </h3>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            Model freight curves, verify draft feasibility, and structure your COA portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('optimizer')}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            Launch Vessel Optimizer
          </button>
          <button
            onClick={() => onNavigateTab('intelligence')}
            className="px-5 py-3 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            View AI Forecasts
          </button>
        </div>
      </div>

    </div>
  );
};
