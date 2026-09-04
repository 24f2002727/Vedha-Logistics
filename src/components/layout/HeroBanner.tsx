import React, { useState } from 'react';
import { 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  Anchor, 
  MapPin, 
  Layers, 
  Sparkles,
  Gauge
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { MaritimeMapBackground } from './MaritimeMapBackground';

interface HeroBannerProps {
  onQuickSimulate: (originId: string, destId: string, volume: number) => void;
  onExploreCOA: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onQuickSimulate, onExploreCOA }) => {
  const [selectedOrigin, setSelectedOrigin] = useState('au-hay');
  const [selectedDest, setSelectedDest] = useState('in-par');
  const [cargoVolume, setCargoVolume] = useState<number>(75000);
  const [quickEmail, setQuickEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSimulate(selectedOrigin, selectedDest, cargoVolume);
  };

  const handleQuickDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail) {
      setEmailSubmitted(true);
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-slate-200 pt-12 pb-16 min-h-[580px] flex flex-col justify-center">
      
      {/* Intricate Global Maritime Connectivity Routes Map Background (Veson Nautical Aesthetic) */}
      <MaritimeMapBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline - Exactly matching Veson Nautical style & smaller refined title font */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold tracking-tight text-slate-900 leading-[1.2]">
            The AI-powered platform <br />
            <span className="italic font-extrabold text-[#0284C7]">for maritime workflows</span>
          </h1>
          
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Predictive freight rate forecasting and vessel charter optimization for India's East Coast bulk procurement.
          </p>

          {/* Veson Nautical Style Floating Input Bar */}
          <div className="mt-6 max-w-lg mx-auto">
            {!emailSubmitted ? (
              <form onSubmit={handleQuickDemo} className="flex items-center bg-white rounded-full p-1.5 border border-slate-300 shadow-lg shadow-slate-200/60 transition-all hover:border-slate-400">
                <input
                  type="email"
                  required
                  placeholder="Business email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FF5B26] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] shadow-md shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  Request Access
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-full text-xs font-bold shadow-sm">
                ✓ Access request logged for {quickEmail}. Our team will contact you promptly.
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch Feasibility Analyzer Bar */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Instant Route Feasibility & Freight Rate Forecaster</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                AI Engine Active (98.4% Confidence)
              </span>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin Port */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Origin Load Port
                </label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                >
                  <optgroup label="Australia (Coal & Minerals)">
                    {GLOBAL_ORIGIN_PORTS.filter(p => p.country === 'Australia').map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="United States">
                    {GLOBAL_ORIGIN_PORTS.filter(p => p.country === 'United States').map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Indonesia (Thermal Coal)">
                    {GLOBAL_ORIGIN_PORTS.filter(p => p.country === 'Indonesia').map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Mozambique & Russia">
                    {GLOBAL_ORIGIN_PORTS.filter(p => ['Mozambique', 'Russia'].includes(p.country)).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Destination East Coast Port */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5 text-sky-600" /> East Coast Discharge Port
                </label>
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white transition-colors cursor-pointer"
                >
                  {EAST_COAST_INDIAN_PORTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Draft: {p.maxDraft}m {p.isRiverine ? '• Riverine' : ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cargo Volume */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" /> Cargo Parcel Size (MT)
                </label>
                <select
                  value={cargoVolume}
                  onChange={(e) => setCargoVolume(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-600 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value={35000}>35,000 MT (Handysize Parcel)</option>
                  <option value={55000}>55,000 MT (Supramax Parcel)</option>
                  <option value={75000}>75,000 MT (Panamax Standard)</option>
                  <option value={82000}>82,000 MT (Kamsarmax Full Load)</option>
                  <option value={150000}>150,000 MT (Capesize Large)</option>
                  <option value={180000}>180,000 MT (Capesize Deep Draft)</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[42px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Analyze Route</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Value Metrics Row */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 flex items-center justify-center gap-1">
              <TrendingDown className="w-6 h-6 text-emerald-600" />
              <span>18.5%</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-semibold">Avg. Freight Savings (Spot → COA)</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-sky-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-6 h-6 text-sky-600" />
              <span>99.2%</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-semibold">Port Draft & LOA Compliance</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-600 flex items-center justify-center gap-1">
              <Anchor className="w-6 h-6 text-amber-600" />
              <span>7 East Coast</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-semibold">Indian Ports Fully Integrated</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-purple-600 flex items-center justify-center gap-1">
              <Gauge className="w-6 h-6 text-purple-600" />
              <span>180-Day</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-semibold">Forward Rate Forecasting Horizon</p>
          </div>
        </div>

      </div>
    </div>
  );
};
