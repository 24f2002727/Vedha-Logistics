import React, { useState, useEffect } from 'react';
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
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Wind
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { VESSEL_CLASSES } from '../../data/vesselData';
import { CommodityType, VesselType, CurrencyType } from '../../types/maritime';
import { calculateVesselFeasibility } from '../../utils/vesselOptimizer';
import { formatCurrency, formatRatePerMT } from '../../utils/currencyUtils';

interface VesselOptimizerToolProps {
  initialOrigin?: string;
  initialDest?: string;
  initialVolume?: number;
  currency?: CurrencyType;
  onSelectCOA?: (vesselType: VesselType, volume: number) => void;
}

export const VesselOptimizerTool: React.FC<VesselOptimizerToolProps> = ({
  initialOrigin = 'au-hay',
  initialDest = 'in-par',
  initialVolume = 75000,
  currency = 'USD',
  onSelectCOA
}) => {
  const [originId, setOriginId] = useState(initialOrigin);
  const [destId, setDestId] = useState(initialDest);
  const [cargoVolume, setCargoVolume] = useState<number>(initialVolume);
  const [commodity, setCommodity] = useState<CommodityType>('Coking Coal');
  const [horizonMonths, setHorizonMonths] = useState<1 | 3 | 6 | 12>(6);
  const [bunkerPrice, setBunkerPrice] = useState<number>(580);
  const [selectedVesselTab, setSelectedVesselTab] = useState<VesselType>('Panamax');

  // Synchronize state when props update
  useEffect(() => {
    if (initialOrigin) setOriginId(initialOrigin);
  }, [initialOrigin]);

  useEffect(() => {
    if (initialDest) setDestId(initialDest);
  }, [initialDest]);

  useEffect(() => {
    if (initialVolume) setCargoVolume(initialVolume);
  }, [initialVolume]);

  const { results, recommendedVessel, originPort, destPort, route } = calculateVesselFeasibility({
    originPortId: originId,
    destinationPortId: destId,
    cargoVolumeMT: cargoVolume,
    commodity,
    targetLaycanStart: '2026-10-01',
    targetLaycanEnd: '2026-10-15',
    contractHorizonMonths: horizonMonths,
    bunkerPriceSensitivityUSD: bunkerPrice
  });

  const activeVesselFeas = results.find(r => r.vesselType === selectedVesselTab) || recommendedVessel || results[0];
  const activeVesselSpec = VESSEL_CLASSES.find(v => v.type === selectedVesselTab) || VESSEL_CLASSES[3];

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
              Vessel & Port Solver
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono font-bold">
                Draft & LOA Engine
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Multi-constraint solver matching parcel sizes with port rules.
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
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${horizonMonths === m
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Load Origin Port</label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
              >
                {GLOBAL_ORIGIN_PORTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Port */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">East Coast Discharge Port</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
              >
                {EAST_COAST_INDIAN_PORTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Draft: {p.maxDraft}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cargo Commodity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Commodity</label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value as CommodityType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
              >
                <option value="Coking Coal">Coking Coal</option>
                <option value="Thermal Coal">Thermal Coal</option>
                <option value="Iron Ore">Iron Ore</option>
                <option value="Limestone">Limestone</option>
                <option value="Bauxite">Bauxite</option>
              </select>
            </div>

            {/* Cargo Volume */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Parcel Volume</span>
                <span className="font-mono text-orange-600 font-extrabold">{cargoVolume.toLocaleString()} MT</span>
              </div>
              <input
                type="range"
                min="25000"
                max="200000"
                step="5000"
                value={cargoVolume}
                onChange={(e) => setCargoVolume(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                <span>25k (Handy)</span>
                <span>75k (Panamax)</span>
                <span>180k (Cape)</span>
              </div>
            </div>
          </div>

          {/* Quick Route Telemetry */}
          {route && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Route Distance:</span>
                <span className="font-bold text-slate-900">{route.distanceNauticalMiles.toLocaleString()} Nautical Miles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transit Days @ 13.5 kts:</span>
                <span className="font-bold text-slate-900">~{route.typicalTransitDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Chokepoints:</span>
                <span className="font-bold text-orange-600">{route.chokepoints.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Vessel Hero Card (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-r from-slate-900 via-slate-850 to-orange-950/30 p-6 rounded-2xl border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                Recommended Vessel Class
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Score: {recommendedVessel?.feasibilityScore}/100
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                {recommendedVessel?.vesselType.toUpperCase()} BULKER
              </h3>
              <span className="text-xs text-slate-300 font-mono">
                (~{VESSEL_CLASSES.find(v => v.type === recommendedVessel?.vesselType)?.typicalDwt.toLocaleString()} MT Intake)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Optimal balance of parcel economy, draft clearance, and hire economics.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-4">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Landed Freight</span>
                <span className="text-base font-extrabold text-orange-400">
                  {formatRatePerMT(recommendedVessel?.effectiveFreightPerTonUSD || 18.50, currency)}
                </span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Draft Margin</span>
                <span className={`text-base font-extrabold ${(recommendedVessel?.draftMargin || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                  {(recommendedVessel?.draftMargin || 0) >= 0 ? `+${recommendedVessel?.draftMargin}m (Safe)` : `${recommendedVessel?.draftMargin}m (Deficit)`}
                </span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Round Voyage</span>
                <span className="text-base font-extrabold text-white">
                  {recommendedVessel?.totalVoyageDays} Days
                </span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Total Spend</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {formatCurrency(recommendedVessel?.totalVoyageSpendUSD || 0, currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              Handling Time: {Math.ceil((cargoVolume) / (destPort?.cargoHandlingRateTPD || 25000))} Days at {destPort?.name}
            </span>

            {onSelectCOA && recommendedVessel && (
              <button
                onClick={() => onSelectCOA(recommendedVessel.vesselType, cargoVolume)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>Model Contract Strategy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Water-Column & Keel Depth Visualizer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-cyan-600" />
              UKC & Water-Column Visualizer
            </h3>
            <p className="text-xs text-slate-500">
              Depth and draft analysis.
            </p>
          </div>

          {/* Vessel Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            {VESSEL_CLASSES.map(v => (
              <button
                key={v.type}
                onClick={() => setSelectedVesselTab(v.type)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${selectedVesselTab === v.type
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {v.type}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Water Column Box */}
        <div className="relative h-64 w-full bg-gradient-to-b from-sky-950/20 via-blue-950/40 to-slate-900 border border-slate-300 rounded-xl overflow-hidden p-4 flex flex-col justify-between">

          {/* Water Surface Line (0.0m) */}
          <div className="relative z-10 flex items-center justify-between border-b-2 border-cyan-500 pb-1">
            <span className="text-xs font-mono font-bold text-cyan-700 bg-white/80 px-2 py-0.5 rounded shadow-xs">
              🌊 Waterline (Chart Datum 0.0m)
            </span>
            <span className="text-[11px] font-mono text-slate-600 bg-white/80 px-2 py-0.5 rounded">
              {activeVesselSpec.displayName} (Laden)
            </span>
          </div>

          {/* Submerged Hull Visual Bar */}
          <div
            className="absolute left-1/4 right-1/4 top-10 rounded-b-xl border-x-2 border-b-2 border-cyan-400 bg-gradient-to-b from-slate-800/90 via-slate-700/90 to-cyan-900/90 flex flex-col justify-end p-2 transition-all duration-500 shadow-lg text-center"
            style={{ height: `${Math.min(180, activeVesselFeas.waterColumn.vesselDraftPercent * 2.2)}px` }}
          >
            <div className="font-mono text-xs font-extrabold text-cyan-200">
              ⚓ Keel Depth: {activeVesselSpec.typicalDraft}m
            </div>
          </div>

          {/* Port Max Permissible Seabed / Berth Draft Line */}
          <div
            className="absolute left-4 right-4 border-b-2 border-dashed transition-all duration-500 flex items-center justify-between px-2"
            style={{
              top: `${Math.min(210, 40 + activeVesselFeas.waterColumn.portDraftPercent * 2.2)}px`,
              borderColor: activeVesselFeas.waterColumn.isDraftExceeded ? '#EF4444' : '#10B981'
            }}
          >
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-xs ${activeVesselFeas.waterColumn.isDraftExceeded
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
              Port Safe Berth Draft Limit: {destPort?.maxDraft}m
            </span>

            <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">
              {destPort?.name}
            </span>
          </div>

          {/* Bottom Depth Status Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-200 pt-2 border-t border-slate-700 bg-slate-900/90 -mx-4 -mb-4 px-4 py-2.5">
            <div>
              LOA: <span className="font-bold text-white">{activeVesselSpec.typicalLOA}m</span> (Max: {destPort?.maxLOA}m)
            </div>
            <div>
              Beam: <span className="font-bold text-white">{activeVesselSpec.typicalBeam}m</span> (Max: {destPort?.maxBeam}m)
            </div>
            <div>
              Gear: <span className="font-bold text-orange-400">{activeVesselSpec.isGeared ? 'Geared (4x30t)' : 'Gearless'}</span>
            </div>
            <div>
              Status: <span className={`font-bold ${activeVesselFeas.status === 'PASSED' ? 'text-emerald-400' : activeVesselFeas.status === 'RESTRICTED' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                {activeVesselFeas.status === 'PASSED' && `UKC: +${activeVesselFeas.draftMargin}m (Safe)`}
                {activeVesselFeas.status === 'RESTRICTED' && `Lightering Req (${activeVesselFeas.lighterageVolumeMT?.toLocaleString()} MT)`}
                {activeVesselFeas.status === 'REJECTED' && `Draft Deficit: -${Math.abs(activeVesselFeas.draftMargin)}m (Exceeded)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Fleet Comparison Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-display font-bold text-slate-900 pb-2 border-b border-slate-100">
          Complete Fleet Intakes & Landed Cost Breakdown at {destPort?.name}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50 font-sans font-semibold">
                <th className="py-3 px-3">Vessel Class</th>
                <th className="py-3 px-3">Feasibility Status</th>
                <th className="py-3 px-3">Intake Capacity</th>
                <th className="py-3 px-3">Draft Margin</th>
                <th className="py-3 px-3">Lightering / Top-Off</th>
                <th className="py-3 px-3">Landed Rate ($/MT)</th>
                <th className="py-3 px-3">Landed Rate (₹/MT)</th>
                <th className="py-3 px-3">Total Voyage Cost</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((res) => {
                const spec = VESSEL_CLASSES.find(v => v.type === res.vesselType)!;
                return (
                  <tr key={res.vesselType} className={`hover:bg-slate-50 transition-colors ${res.isRecommended ? 'bg-orange-50/40 font-bold' : ''
                    }`}>
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{res.vesselType}</span>
                        {res.isRecommended && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500 text-white font-mono font-bold">
                            BEST
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold inline-flex items-center gap-1 ${res.status === 'PASSED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : res.status === 'RESTRICTED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                        {res.status === 'PASSED' && <CheckCircle2 className="w-3 h-3" />}
                        {res.status === 'RESTRICTED' && <AlertTriangle className="w-3 h-3" />}
                        {res.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        <span>{res.status === 'PASSED' ? 'PASSED' : res.status === 'RESTRICTED' ? 'LIGHTERING REQ' : 'REJECTED'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-800">
                      {(spec.typicalDwt * 0.95).toLocaleString()} MT
                    </td>

                    <td className="py-3 px-3">
                      <span className={res.draftMargin >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                        {res.draftMargin >= 0 ? `+${res.draftMargin}m` : `${res.draftMargin}m`}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {res.requiresLighterage && res.lighterageVolumeMT ? (
                        <span className="text-amber-700 font-bold">
                          {res.lighterageVolumeMT.toLocaleString()} MT (+${res.lighterageCostUSDPerTon.toFixed(2)}/t)
                        </span>
                      ) : (
                        <span className="text-slate-400">Direct Berthing</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900">
                      ${res.effectiveFreightPerTonUSD.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {formatRatePerMT(res.effectiveFreightPerTonUSD, 'INR')}
                    </td>

                    <td className="py-3 px-3 text-slate-800">
                      {formatCurrency(res.totalVoyageSpendUSD, currency)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {onSelectCOA && res.isFeasible && (
                        <button
                          onClick={() => onSelectCOA(res.vesselType, cargoVolume)}
                          className="text-orange-600 hover:text-orange-700 font-bold font-sans hover:underline cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
