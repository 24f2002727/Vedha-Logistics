import React, { useState } from 'react';
import {
  Ship,
  TrendingUp,
  Leaf,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Anchor,
  Layers,
  Zap,
  ChevronRight,
  ShieldCheck,
  Compass,
  Award,
  Wind
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { WorldMapHeroBackground } from './WorldMapHeroBackground';

interface LandingHomePageProps {
  onNavigateTab: (tabId: string) => void;
  onQuickSimulate: (originId: string, destId: string, volume: number) => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  onNavigateTab,
  onQuickSimulate
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState('au-hay');
  const [selectedDest, setSelectedDest] = useState('in-par');
  const [cargoVolume, setCargoVolume] = useState<number>(75000);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSimulate(selectedOrigin, selectedDest, cargoVolume);
  };

  const coreProblems = [
    {
      id: 'market-timing',
      problemLetter: 'A',
      title: 'Optimal Market Entry Timing',
      tagline: 'Rate Forecasting & Entry Windows',
      description: 'Identify ideal windows to secure short-term or mid-term vessel charter contracts for specific cargo requirements, minimizing freight costs through 180-day AI forward curves.',
      metric: '180-Day Forecast',
      badge: 'ML Forward Curve Engine',
      badgeColor: 'text-orange-600 bg-orange-50 border-orange-200',
      actionText: 'Analyze Market Timing Radar'
    },
    {
      id: 'vessel-optimizer',
      problemLetter: 'B',
      title: 'Vessel Type Optimization',
      tagline: 'Port Infrastructure & Draft Limitations',
      description: 'Recommend the most suitable vessel type (Handysize, Supramax, Panamax, Capesize) for cargo volumes and origin-destination pairs, strictly accounting for Indian East Coast draft, LOA, and handling rates.',
      metric: 'Handysize to Capesize',
      badge: 'UKC Draft & LOA Solver',
      badgeColor: 'text-sky-600 bg-sky-50 border-sky-200',
      actionText: 'Launch Vessel Optimizer'
    },
    {
      id: 'idle-management',
      problemLetter: 'C',
      title: 'Idle Scenario Management',
      tagline: 'Virtual Arrival & Ballast Triangulation',
      description: 'Minimize vessel idle time by absorbing known port delays at sea via Just-In-Time Virtual Arrival and forecasting low-demand periods with backhaul triangulation to eliminate deadheading.',
      metric: 'Zero Anchorage Idle',
      badge: 'JIT Eco-Steaming & CII',
      badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
      actionText: 'Simulate Idle Reduction'
    },
    {
      id: 'risk-mitigation',
      problemLetter: 'D',
      title: 'Risk Mitigation & Early Warnings',
      tagline: 'Congestion Radar & Disruption Stress Tests',
      description: 'Receive real-time early warnings for potential market volatility, port queue spikes, monsoon swells, and geopolitical chokepoints with automated mitigation playbooks.',
      metric: 'Live Disruption Radar',
      badge: 'AIS Telemetry & Macro Shocks',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      actionText: 'Open Risk Mitigation Center'
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-300">

      {/* 1. Hero Section with Interactive World Map Background */}
      <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl overflow-hidden min-h-[480px] flex flex-col justify-center">

        {/* World Maritime Sea Routes Vector Map Background */}
        <WorldMapHeroBackground />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>AI MARITIME PROCUREMENT INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Predictive Maritime Logistics Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Engineered for India&apos;s East Coast bulk procurement: solving market entry timing, vessel class selection, idle time reduction, and laytime risk mitigation.
          </p>
        </div>

        {/* Hero Interactive Quick Route & Rate Estimator Bar */}
        <div className="relative z-10 mt-10 max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Instant Corridor &amp; Vessel Solver
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              East Coast India Physical Constraints Active
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
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 transition-all cursor-pointer group"
              >
                <span>Optimize Route</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Four Core Problem Pillars Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">
              Core Problem Solutions Matrix
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Four specialized analytical engines addressing the primary challenges in dry bulk maritime chartering.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreProblems.map((sol) => (
            <div
              key={sol.id}
              className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => onNavigateTab(sol.id)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                    {sol.problemLetter}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${sol.badgeColor}`}>
                    {sol.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                    {sol.tagline}
                  </span>
                  <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-orange-600 transition-colors mt-0.5">
                    {sol.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {sol.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                <span>{sol.actionText}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. East Coast Ports Physical Infrastructure Snapshot */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-sky-600" />
            <span>India East Coast Port Limitations &amp; Draft Baselines</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Critical constraints factored directly into vessel nominations to prevent tidal delays, grounding risks, and demurrage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EAST_COAST_INDIAN_PORTS.slice(0, 4).map((port) => (
            <div
              key={port.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{port.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
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
                  <span className="font-bold text-emerald-700">{port.avgWaitingDays}d Queue</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Handling:</span>
                  <span className="font-bold text-slate-800">{(port.cargoHandlingRateTPD / 1000).toFixed(0)}k TPD</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-tight pt-1 border-t border-slate-200 line-clamp-2">
                {port.infrastructureNotes}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
