import React, { useState } from 'react';
import { 
  Leaf, 
  Wind, 
  Fuel, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  Anchor, 
  Zap, 
  Compass, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { VesselType, CurrencyType } from '../../types/maritime';
import { calculateVirtualArrival } from '../../utils/virtualArrival';
import { formatCurrency, formatUSD } from '../../utils/currencyUtils';

interface VirtualArrivalSimulatorProps {
  currency?: CurrencyType;
  onNavigateToContracts?: () => void;
}

export const VirtualArrivalSimulator: React.FC<VirtualArrivalSimulatorProps> = ({
  currency = 'USD',
  onNavigateToContracts
}) => {
  const [selectedVessel, setSelectedVessel] = useState<VesselType>('Capesize');
  const [distanceNM, setDistanceNM] = useState<number>(5400); // Australia to Dhamra
  const [originalSpeedKts, setOriginalSpeedKts] = useState<number>(13.5);
  const [optimizedSpeedKts, setOptimizedSpeedKts] = useState<number>(10.8);
  const [portDelayDays, setPortDelayDays] = useState<number>(4.0);
  const [vlsfoPriceUSD, setVlsfoPriceUSD] = useState<number>(618);

  const sim = calculateVirtualArrival({
    vesselType: selectedVessel,
    distanceNM,
    originalSpeedKts,
    optimizedSpeedKts,
    knownPortDelayDays: portDelayDays,
    vlsfoPriceUSD
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Leaf className="w-3.5 h-3.5" />
            <span>JUST-IN-TIME STEAMING & IMO CII SIMULATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
            Virtual Arrival & Green Steaming Hydrodynamic Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Eliminate the wasteful &quot;rush-and-wait&quot; cycle. When East Coast port waiting queues are known in advance, slow down at sea. Non-linear cubic propeller laws drastically slash bunker fuel burn, avoid demurrage, and abate carbon emissions.
          </p>
        </div>

        {onNavigateToContracts && (
          <button
            onClick={onNavigateToContracts}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md shrink-0 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <span>Lock COA Laycans</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Simulator Parameters Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <span>Voyage Speed & Destination Port Delay Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vessel Class */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Vessel Class
            </label>
            <select
              value={selectedVessel}
              onChange={(e) => setSelectedVessel(e.target.value as VesselType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:bg-white cursor-pointer"
            >
              <option value="Capesize">Capesize (180k DWT • 48 MT/d fuel)</option>
              <option value="Kamsarmax">Kamsarmax (82k DWT • 29.5 MT/d fuel)</option>
              <option value="Panamax">Panamax (75k DWT • 28 MT/d fuel)</option>
              <option value="Ultramax">Ultramax (63.5k DWT • 25.5 MT/d fuel)</option>
              <option value="Supramax">Supramax (55k DWT • 24 MT/d fuel)</option>
              <option value="Handysize">Handysize (35k DWT • 18.5 MT/d fuel)</option>
            </select>
          </div>

          {/* Trade Route Corridor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Trade Route Distance: <span className="font-mono text-cyan-700">{distanceNM} NM</span>
            </label>
            <select
              value={distanceNM}
              onChange={(e) => setDistanceNM(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:bg-white cursor-pointer"
            >
              <option value="5400">Australia to Dhamra / Paradip (5,400 NM)</option>
              <option value="4720">South Africa (Richards Bay) to Vizag (4,720 NM)</option>
              <option value="2520">Indonesia (Taboneo) to Haldia / Paradip (2,520 NM)</option>
              <option value="10850">US East Coast (Norfolk) to Gangavaram (10,850 NM)</option>
              <option value="7800">Russia (Taman) to Paradip (7,800 NM)</option>
            </select>
          </div>

          {/* Destination Anchorage Delay Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 uppercase tracking-wider">Known Port Queue Wait</span>
              <span className="font-mono text-amber-600 font-extrabold">{portDelayDays.toFixed(1)} Days</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={portDelayDays}
              onChange={(e) => setPortDelayDays(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono font-semibold">
              <span>1 Day (Clear)</span>
              <span>4 Days (Avg)</span>
              <span>10 Days (Severe)</span>
            </div>
          </div>

          {/* Virtual Arrival Optimized Speed Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 uppercase tracking-wider">Virtual Arrival Speed</span>
              <span className="font-mono text-emerald-600 font-extrabold">{optimizedSpeedKts.toFixed(1)} Knots</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="14.0"
              step="0.2"
              value={optimizedSpeedKts}
              onChange={(e) => setOptimizedSpeedKts(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono font-semibold">
              <span>10.0 kts (Slow)</span>
              <span>12.0 kts (Eco)</span>
              <span>14.0 kts (Max)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Green Savings Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Financial Savings */}
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Net Financial Savings</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {formatCurrency(sim.savings.netFinancialBenefitUSD, currency)}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Bunker fuel + demurrage avoided
          </div>
        </div>

        {/* Bunker Fuel Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Bunker Fuel Saved</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            {sim.savings.fuelSavedMT} MT VLSFO
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Value: {formatUSD(sim.savings.fuelSavedUSD)}
          </div>
        </div>

        {/* Scope 1 GHG Abatement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Scope 1 CO2 Abatement</span>
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-teal-700 font-mono">
            {sim.savings.co2SavedMT} MT CO2e
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Direct environmental benefit
          </div>
        </div>

        {/* IMO CII Rating Upgrade */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">IMO CII Rating Impact</span>
            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-cyan-700 font-mono">
            +{sim.savings.ciiReductionPercent}% Better
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Upgraded from Grade {sim.savings.ciiOldGrade} ➔ Grade {sim.savings.ciiNewGrade}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fast Steaming Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                Traditional &quot;Rush &amp; Wait&quot;
              </span>
              <h4 className="text-base font-display font-bold text-slate-900 mt-1">Full Speed ({originalSpeedKts.toFixed(1)} kts)</h4>
            </div>
            <span className="text-xs font-mono text-slate-500">{sim.original.seaDays} Sea Days</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Anchorage Idle Wait Time:</span>
              <span className="text-rose-600 font-bold">{sim.original.anchorDays} Days at Anchor</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Total Fuel Burned:</span>
              <span className="text-slate-900 font-bold">{sim.original.totalFuelMT} MT VLSFO</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Bunker Fuel Expense:</span>
              <span className="text-slate-900 font-bold">{formatCurrency(sim.original.bunkerCostUSD, currency)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Demurrage Waiting Penalty:</span>
              <span className="text-rose-600 font-bold">{formatCurrency(sim.original.demurrageUSD, currency)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold text-slate-900">
              <span>Total Voyage Cost:</span>
              <span>{formatCurrency(sim.original.totalCostUSD, currency)}</span>
            </div>
          </div>
        </div>

        {/* Virtual Arrival Profile */}
        <div className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                Virtual Arrival JIT Steaming
              </span>
              <h4 className="text-base font-display font-bold text-emerald-950 mt-1">Slow Steaming ({optimizedSpeedKts.toFixed(1)} kts)</h4>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">{sim.optimized.seaDays} Sea Days</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-emerald-100 text-slate-600">
              <span>Anchorage Idle Wait Time:</span>
              <span className="text-emerald-700 font-bold">{sim.optimized.anchorDays} Days (Just-In-Time)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-emerald-100 text-slate-600">
              <span>Total Fuel Burned:</span>
              <span className="text-emerald-800 font-bold">{sim.optimized.totalFuelMT} MT VLSFO</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-emerald-100 text-slate-600">
              <span>Bunker Fuel Expense:</span>
              <span className="text-emerald-800 font-bold">{formatCurrency(sim.optimized.bunkerCostUSD, currency)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-emerald-100 text-slate-600">
              <span>Demurrage Waiting Penalty:</span>
              <span className="text-emerald-700 font-bold">{formatCurrency(sim.optimized.demurrageUSD, currency)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold text-emerald-900">
              <span>Total Voyage Cost:</span>
              <span>{formatCurrency(sim.optimized.totalCostUSD, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backhaul Triangulation & Positioning Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-display font-bold text-slate-900 flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-500" />
            Backhaul Triangulation & Ballast Deadheading Reduction Opportunities
          </span>
          <span className="text-xs font-mono text-slate-500 font-medium">
            Avoid empty return voyages
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sim.backhaulRecommendations.map((bh, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-500">
                <span>Triangulation Route #{idx + 1}</span>
                <span className="text-emerald-700">+{bh.ballastDaysSaved}d Ballast Cut</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                {bh.originPort} ➔ {bh.backhaulDischargePort}
              </h4>
              <div className="text-xs text-slate-600">
                Cargo: <strong className="text-slate-800">{bh.commodity}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono">
                <span className="text-slate-500">Projected Freight Revenue:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(bh.projectedRevenueUSD, currency)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
