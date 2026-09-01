import React, { useState } from 'react';
import { 
  Ship, 
  Anchor, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Fuel, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Info 
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { VESSEL_CLASSES } from '../../data/vesselData';
import { CommodityType, VesselType } from '../../types/maritime';
import { calculateVesselFeasibility } from '../../utils/vesselOptimizer';

interface VesselOptimizerToolProps {
  initialOrigin?: string;
  initialDest?: string;
  initialVolume?: number;
  onSelectCOA?: (vesselType: VesselType, volume: number) => void;
}

export const VesselOptimizerTool: React.FC<VesselOptimizerToolProps> = ({
  initialOrigin = 'au-hay',
  initialDest = 'in-par',
  initialVolume = 75000,
  onSelectCOA
}) => {
  const [originId, setOriginId] = useState(initialOrigin);
  const [destId, setDestId] = useState(initialDest);
  const [cargoVolume, setCargoVolume] = useState<number>(initialVolume);
  const [commodity, setCommodity] = useState<CommodityType>('Coking Coal');
  const [horizonMonths, setHorizonMonths] = useState<1 | 3 | 6 | 12>(6);
  const [bunkerPrice, setBunkerPrice] = useState<number>(580);

  const { results, recommendedVessel, destPort, route } = calculateVesselFeasibility({
    originPortId: originId,
    destinationPortId: destId,
    cargoVolumeMT: cargoVolume,
    commodity,
    targetLaycanStart: '2026-10-01',
    targetLaycanEnd: '2026-10-15',
    contractHorizonMonths: horizonMonths,
    bunkerPriceSensitivityUSD: bunkerPrice
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Tool Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Vessel Selection & Port Infrastructure Solver
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono font-bold">
                Draft & LOA Engine
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Automated multi-constraint solver matching cargo parcel sizes with East Coast India draft, LOA, beam, and lighterage rules.
            </p>
          </div>
        </div>

        {/* Contract Horizon Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-2">Horizon:</span>
          {([1, 3, 6, 12] as const).map((m) => (
            <button
              key={m}
              onClick={() => setHorizonMonths(m)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                horizonMonths === m
                  ? 'bg-white text-orange-600 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m === 1 ? 'Spot' : `${m}M COA`}
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters & Port Infrastructure Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            Voyage & Cargo Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin Port */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Origin Load Port
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
              >
                <optgroup label="Australia">
                  {GLOBAL_ORIGIN_PORTS.filter(p => p.country === 'Australia').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </optgroup>
                <optgroup label="United States">
                  {GLOBAL_ORIGIN_PORTS.filter(p => p.country === 'United States').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Indonesia">
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

            {/* Destination Port */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-sky-600" /> East Coast Port
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-sky-600 focus:bg-white cursor-pointer"
              >
                {EAST_COAST_INDIAN_PORTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cargo Volume */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Cargo Parcel Size (MT)
              </label>
              <input
                type="number"
                step="5000"
                value={cargoVolume}
                onChange={(e) => setCargoVolume(Math.max(10000, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 font-bold focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* Commodity */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Commodity
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value as CommodityType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
              >
                <option value="Coking Coal">Coking Coal (Met Coal)</option>
                <option value="Thermal Coal">Thermal Coal (Steam Coal)</option>
                <option value="Iron Ore">Iron Ore Pellets / Fines</option>
                <option value="Limestone">Limestone / Dolomite</option>
                <option value="Bauxite">Bauxite / Minerals</option>
              </select>
            </div>
          </div>

          {/* Bunker Price */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-600" /> Bunker Benchmark (Singapore VLSFO)
              </span>
              <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                ${bunkerPrice} / MT
              </span>
            </div>
            <input
              type="range"
              min="480"
              max="720"
              step="10"
              value={bunkerPrice}
              onChange={(e) => setBunkerPrice(Number(e.target.value))}
              className="w-full accent-orange-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Quick Route Summary */}
          {route && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-500 font-medium">Sailing Distance:</span>
                <span className="text-slate-900 font-bold">{route.distanceNauticalMiles.toLocaleString()} NM</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500 font-medium">Chokepoints:</span>
                <span className="text-slate-800 font-semibold">{route.chokepoints.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Port Infrastructure Constraints Card (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Port Constraints Verification
            </span>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
              {destPort?.name} ({destPort?.code})
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Max Draft</span>
              <span className="text-xl font-display font-extrabold text-sky-700">{destPort?.maxDraft}m</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">{destPort?.isRiverine ? 'Tidal River' : 'Deepwater'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Max LOA</span>
              <span className="text-xl font-display font-extrabold text-slate-900">{destPort?.maxLOA}m</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">Length Overall</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Discharge Rate</span>
              <span className="text-xl font-display font-extrabold text-emerald-700">
                {destPort?.cargoHandlingRateTPD.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">Tons / 24h</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Queue Time</span>
              <span className="text-xl font-display font-extrabold text-amber-700">
                {destPort?.avgWaitingDays} Days
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">{destPort?.congestionStatus} Status</span>
            </div>
          </div>

          {/* Infrastructure Warnings */}
          {destPort?.isRiverine && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800">
                <span className="font-bold text-amber-800">Riverine Draft Notice for Haldia/Hooghly:</span>
                <p className="mt-0.5 leading-relaxed">
                  Direct Capesize berthing is impossible due to the 8.5m river bar limit. Capesize cargo must be lightered at Sagar-Sandheads anchorage into daughter barges, or lifted directly in Geared Supramax / Handysize bulkers.
                </p>
              </div>
            </div>
          )}

          {destPort?.id === 'in-par' && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800">
                <span className="font-bold text-sky-800">Paradip Mechanized Coal Berth Compatibility:</span>
                <p className="mt-0.5 leading-relaxed">
                  Paradip handles up to 16.0m draft at its mechanized coal terminal. Panamax and Kamsarmax achieve 100% draft efficiency without lighterage.
                </p>
              </div>
            </div>
          )}

          {/* Berth & Operational Notes */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong className="text-slate-900 font-bold">Port Operations Note: </strong>
            {destPort?.infrastructureNotes}
          </div>
        </div>

      </div>

      {/* AI Recommendation Spotlight Card */}
      {recommendedVessel && (
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white p-6 sm:p-7 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-white text-orange-600 shadow-xs flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-orange-600" /> Optimal Vessel Recommendation
                </span>
                <span className="text-xs text-orange-100 font-mono font-bold">
                  Feasibility Score: {recommendedVessel.feasibilityScore}/100
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-2">
                {recommendedVessel.vesselType} Bulker
              </h3>
              <p className="text-xs text-orange-100 max-w-2xl leading-relaxed">
                Provides the highest intake utilization with full draft clearance for <strong className="text-white font-bold">{destPort?.name}</strong>. 
                Effective landed freight is <strong className="text-white font-mono font-bold">${recommendedVessel.effectiveFreightPerTonUSD}/MT</strong> with total voyage duration of {recommendedVessel.totalVoyageDays} days.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/20 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-orange-200 block font-semibold">Effective Landed Freight</span>
                <span className="text-3xl font-display font-extrabold text-white font-mono">
                  ${recommendedVessel.effectiveFreightPerTonUSD}
                </span>
                <span className="text-[10px] text-orange-200 block font-medium">per metric ton</span>
              </div>

              {onSelectCOA && (
                <button
                  onClick={() => onSelectCOA(recommendedVessel.vesselType, cargoVolume)}
                  className="px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-orange-50 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Build COA Contract</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparative Vessel Class Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-display font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Comparative Vessel Class Matrix</span>
          <span className="text-xs font-mono text-slate-500 font-normal">
            Handysize • Supramax • Ultramax • Panamax • Kamsarmax • Capesize
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => {
            const spec = VESSEL_CLASSES.find(v => v.type === item.vesselType);
            return (
              <div
                key={item.vesselType}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  item.isRecommended
                    ? 'bg-orange-50/50 border-orange-400 ring-2 ring-orange-400/30'
                    : item.isFeasible
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    : 'bg-rose-50/40 border-rose-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Ship className={`w-4 h-4 ${item.isRecommended ? 'text-orange-600' : 'text-slate-600'}`} />
                      <span className="font-bold text-slate-900 text-sm">{item.vesselType}</span>
                    </div>

                    {item.isRecommended ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-600 text-white uppercase">
                        Recommended
                      </span>
                    ) : item.requiresLighterage ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Needs Lightering
                      </span>
                    ) : item.isFeasible ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Feasible
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        Restricted
                      </span>
                    )}
                  </div>

                  {/* Vessel Specs */}
                  <div className="text-[11px] text-slate-600 space-y-1.5 my-3 bg-slate-50 p-3 rounded-lg font-mono border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Typical DWT:</span>
                      <span className="text-slate-900 font-bold">{spec?.typicalDwt.toLocaleString()} MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Laden Draft:</span>
                      <span className={`${(spec?.typicalDraft || 0) > (destPort?.maxDraft || 20) ? 'text-amber-700 font-bold' : 'text-slate-900'}`}>
                        {spec?.typicalDraft}m (Port: {destPort?.maxDraft}m)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Voyage Days:</span>
                      <span className="text-slate-900 font-bold">{item.totalVoyageDays} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Demurrage Risk:</span>
                      <span className={`font-bold ${item.demurrageRiskProbability > 30 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {item.demurrageRiskProbability}%
                      </span>
                    </div>
                  </div>

                  {/* Warning/Notes */}
                  {item.reasons.length > 0 && (
                    <div className="text-[10px] text-amber-800 mb-3 space-y-0.5">
                      {item.reasons.map((r, i) => (
                        <p key={i}>• {r}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Landed $/MT</span>
                    <span className="text-lg font-extrabold font-mono text-slate-900">
                      ${item.effectiveFreightPerTonUSD}/t
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Voyage Spend</span>
                    <span className="text-xs font-bold font-mono text-slate-700">
                      ${(item.totalVoyageSpendUSD / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
