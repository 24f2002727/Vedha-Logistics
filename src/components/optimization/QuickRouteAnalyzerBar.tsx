import React, { useState } from 'react';
import { Sparkles, MapPin, Anchor, Layers, ArrowRight } from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';

interface QuickRouteAnalyzerBarProps {
  onAnalyze: (originId: string, destId: string, volume: number) => void;
  defaultOrigin?: string;
  defaultDest?: string;
  defaultVolume?: number;
}

export const QuickRouteAnalyzerBar: React.FC<QuickRouteAnalyzerBarProps> = ({
  onAnalyze,
  defaultOrigin = 'au-hay',
  defaultDest = 'in-par',
  defaultVolume = 75000
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState(defaultOrigin);
  const [selectedDest, setSelectedDest] = useState(defaultDest);
  const [cargoVolume, setCargoVolume] = useState<number>(defaultVolume);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(selectedOrigin, selectedDest, cargoVolume);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Quick Route Feasibility &amp; Draft Matcher</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
          Multi-Constraint Draft &amp; LOA Solver Active
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
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
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
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white transition-colors cursor-pointer"
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
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-600 focus:bg-white transition-colors cursor-pointer"
          >
            <option value={35000}>35,000 MT (Handysize Parcel)</option>
            <option value={55000}>55,000 MT (Supramax Parcel)</option>
            <option value={63500}>63,500 MT (Ultramax Parcel)</option>
            <option value={75000}>75,000 MT (Panamax Standard)</option>
            <option value={82000}>82,000 MT (Kamsarmax Intake)</option>
            <option value={150000}>150,000 MT (Capesize Baby)</option>
            <option value={180000}>180,000 MT (Capesize Deep Draft)</option>
          </select>
        </div>

        {/* Submit Action Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <span>Analyze Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
