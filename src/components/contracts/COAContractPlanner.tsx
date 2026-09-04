import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  TrendingDown, 
  FileCheck, 
  Check, 
  Download,
  Calendar,
  ShieldCheck,
  Zap,
  Sliders,
  AlertTriangle,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { VESSEL_CLASSES } from '../../data/vesselData';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { VesselType, CurrencyType } from '../../types/maritime';
import { simulateCOAScenarios, runMILPPortfolioOptimizer } from '../../utils/contractSimulator';
import { formatCurrency, formatRatePerMT, formatUSD } from '../../utils/currencyUtils';

interface COAContractPlannerProps {
  initialVessel?: VesselType;
  initialVolume?: number;
  currency?: CurrencyType;
  onExportReport: () => void;
}

export const COAContractPlanner: React.FC<COAContractPlannerProps> = ({
  initialVessel = 'Panamax',
  initialVolume = 600000,
  currency = 'USD',
  onExportReport
}) => {
  const [originId, setOriginId] = useState<string>('au-hay');
  const [destId, setDestId] = useState<string>('in-par');
  const [selectedVessel, setSelectedVessel] = useState<VesselType>(initialVessel);
  const [annualVolumeMT, setAnnualVolumeMT] = useState<number>(initialVolume);
  const [baseSpotRateUSD, setBaseSpotRateUSD] = useState<number>(18.50);
  const [horizonMonths, setHorizonMonths] = useState<number>(6);
  const [riskTolerance, setRiskTolerance] = useState<number>(50); // 0 (Aggressive Spot) to 100 (Conservative TC)
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // 6-Month COA

  useEffect(() => {
    if (initialVessel) setSelectedVessel(initialVessel);
  }, [initialVessel]);

  useEffect(() => {
    if (initialVolume) setAnnualVolumeMT(initialVolume);
  }, [initialVolume]);

  const scenarios = simulateCOAScenarios(annualVolumeMT, selectedVessel, baseSpotRateUSD);

  const milp = runMILPPortfolioOptimizer({
    originPortId: originId,
    dischargePortId: destId,
    totalVolumeMT: annualVolumeMT,
    deliveryHorizonMonths: horizonMonths,
    riskTolerancePercent: riskTolerance,
    vesselType: selectedVessel,
    baseSpotRateUSD
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Contract &amp; Strategy Optimizer
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                Portfolio Solver
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Solver balancing COA, Time Charters, and Spot fixtures with risk-adjusted landed costs.
            </p>
          </div>
        </div>

        <button
          onClick={onExportReport}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Strategy Report</span>
        </button>
      </div>

      {/* Inputs: Route, Volume & Risk Tolerance */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Load Port */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Origin Load Port</label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
          >
            {GLOBAL_ORIGIN_PORTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
            ))}
          </select>
        </div>

        {/* Discharge Port */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">East Coast Discharge Port</label>
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
          >
            {EAST_COAST_INDIAN_PORTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (Draft: {p.maxDraft}m)</option>
            ))}
          </select>
        </div>

        {/* Vessel Class */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Vessel Class</label>
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value as VesselType)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
          >
            {VESSEL_CLASSES.map(v => (
              <option key={v.type} value={v.type}>{v.displayName} (~{v.typicalDwt.toLocaleString()} MT)</option>
            ))}
          </select>
        </div>

        {/* Contract Horizon */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Horizon</label>
          <select
            value={horizonMonths}
            onChange={(e) => setHorizonMonths(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
          >
            <option value={3}>3 Months (Quarterly Program)</option>
            <option value={6}>6 Months (Semi-Annual Program)</option>
            <option value={12}>12 Months (Annual Program)</option>
          </select>
        </div>

        {/* Annual Volume Slider */}
        <div className="sm:col-span-2 space-y-1">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-slate-700">Total Program Volume:</span>
            <span className="font-mono text-orange-600 font-extrabold">{annualVolumeMT.toLocaleString()} MT</span>
          </div>
          <input
            type="range"
            min="100000"
            max="2500000"
            step="50000"
            value={annualVolumeMT}
            onChange={(e) => setAnnualVolumeMT(Number(e.target.value))}
            className="w-full accent-orange-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>100K MT</span>
            <span>1.0M MT</span>
            <span>2.5M MT</span>
          </div>
        </div>

        {/* Risk Tolerance Slider */}
        <div className="sm:col-span-2 space-y-1">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-slate-700">Risk Preference:</span>
            <span className="font-mono text-cyan-700 font-extrabold">
              {riskTolerance <= 30 ? 'Cost Minimizer (Spot Agility)' : riskTolerance <= 70 ? 'Balanced Hybrid (Optimal)' : 'Conservative Budget Shield'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(Number(e.target.value))}
            className="w-full accent-cyan-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (100% Spot Agility)</span>
            <span>50% (Recommended Split)</span>
            <span>100% (Maximum Fixed Coverage)</span>
          </div>
        </div>
      </div>

      {/* MILP Optimized Strategy Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-orange-950/30 p-6 rounded-2xl border border-slate-800 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              MILP Portfolio Solution
            </span>
          </div>
          <span className="text-xs font-mono text-slate-300">
            {milp.allocations.length} Programmed Liftings across {horizonMonths} Months
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Projected Savings</span>
            <span className="text-lg font-extrabold text-emerald-400">
              {formatCurrency(milp.netSavingsUSD, currency)} ({milp.savingsPercentage}%)
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">vs unhedged spot</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Landed Freight Rate</span>
            <span className="text-lg font-extrabold text-orange-400">
              {formatRatePerMT(milp.costComparison.recommendedHybrid.costPerMTUSD, currency)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Spot: {formatRatePerMT(milp.costComparison.pureSpot.costPerMTUSD, currency)}</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block">VaR95 Tail-Risk Cut</span>
            <span className="text-lg font-extrabold text-cyan-400">
              -{milp.riskReductionPercent}% Risk
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Value at Risk 95%</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Contract Breakdown</span>
            <span className="text-xs font-extrabold text-white block mt-1">
              COA: {milp.costComparison.recommendedHybrid.coaSharePercent}% • TC: {milp.costComparison.recommendedHybrid.tcSharePercent}% • Spot: {milp.costComparison.recommendedHybrid.spotSharePercent}%
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {milp.executionPlanSummary}
        </p>
      </div>

      {/* Landed Cost Scenario Waterfall Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-display font-bold text-slate-900 pb-2 border-b border-slate-100">
          Landed Cost Scenario Comparison Waterfall
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scenario 1: Pure Spot */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase font-mono">100% Spot Market</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">High Risk</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {formatRatePerMT(milp.costComparison.pureSpot.costPerMTUSD, currency)}
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Total Spend:</span>
                <span className="font-bold text-slate-900">{formatCurrency(milp.costComparison.pureSpot.totalCostUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Demurrage Risk:</span>
                <span className="text-rose-600 font-bold">{formatCurrency(milp.costComparison.pureSpot.demurrageRiskUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>VaR (95% Tail):</span>
                <span className="text-rose-600 font-bold">{formatCurrency(milp.costComparison.pureSpot.valueAtRisk95USD, currency)}</span>
              </div>
            </div>
          </div>

          {/* Scenario 2: Optimized Hybrid (MILP) */}
          <div className="bg-emerald-50/50 p-5 rounded-2xl border-2 border-emerald-400 space-y-3 relative shadow-md">
            <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold">
              RECOMMENDED
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-900 uppercase font-mono">Optimized Hybrid (MILP)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Optimal</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700">
              {formatRatePerMT(milp.costComparison.recommendedHybrid.costPerMTUSD, currency)}
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-600 pt-2 border-t border-emerald-200">
              <div className="flex justify-between">
                <span>Total Spend:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(milp.costComparison.recommendedHybrid.totalCostUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Demurrage Risk:</span>
                <span className="text-emerald-700 font-bold">{formatCurrency(milp.costComparison.recommendedHybrid.demurrageRiskUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>VaR (95% Tail):</span>
                <span className="text-emerald-700 font-bold">{formatCurrency(milp.costComparison.recommendedHybrid.valueAtRisk95USD, currency)}</span>
              </div>
            </div>
          </div>

          {/* Scenario 3: Fixed Period TC */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase font-mono">100% Period Charter</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">Fixed Rate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {formatRatePerMT(milp.costComparison.fixedTimeCharter.costPerMTUSD, currency)}
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Total Spend:</span>
                <span className="font-bold text-slate-900">{formatCurrency(milp.costComparison.fixedTimeCharter.totalCostUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Demurrage Risk:</span>
                <span className="text-cyan-700 font-bold">{formatCurrency(milp.costComparison.fixedTimeCharter.demurrageRiskUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>VaR (95% Tail):</span>
                <span className="text-cyan-700 font-bold">{formatCurrency(milp.costComparison.fixedTimeCharter.valueAtRisk95USD, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programmed Voyage Laycan Schedule Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900">
              Programmed Voyage Laycan Schedule
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Sequential vessel liftings with contract assignment and laycan dates.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            Total {milp.allocations.length} Liftings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50 font-sans font-semibold">
                <th className="py-2.5 px-3">Voyage #</th>
                <th className="py-2.5 px-3">Contract Mode</th>
                <th className="py-2.5 px-3">Laycan Window</th>
                <th className="py-2.5 px-3">Parcel Intake</th>
                <th className="py-2.5 px-3">Freight Rate</th>
                <th className="py-2.5 px-3">Estimated Cost</th>
                <th className="py-2.5 px-3">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {milp.allocations.map((a) => (
                <tr key={a.voyageNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">
                    Lifting #{a.voyageNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.contractType === 'COA'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : a.contractType === 'TimeCharter'
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {a.contractType === 'COA' ? '6M COA' : a.contractType === 'TimeCharter' ? 'Period TC' : 'Spot Fixture'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">
                    📅 {a.laycanWindowStart} ➔ {a.laycanWindowEnd}
                  </td>
                  <td className="py-2.5 px-3 text-slate-900 font-bold">
                    {a.parcelSizeMT.toLocaleString()} MT ({a.vesselClass})
                  </td>
                  <td className="py-2.5 px-3 font-bold text-orange-600">
                    {formatRatePerMT(a.freightRatePerMT, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-900 font-bold">
                    {formatCurrency(a.totalCostUSD, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans text-[11px]">
                    {a.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BIMCO Standard Clauses & Risk Protection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <span>BIMCO Structured Contract Terms &amp; Risk Clauses</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 font-sans block">BIMCO Bunker Adjustment Factor (BAF) Clause</span>
            <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
              Base bunker benchmark pegged at $580.00/MT VLSFO Singapore. Freight rate adjusts by ±$0.024/MT per $1.00/MT bunker variance outside the ±$25.00 collar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 font-sans block">Laytime &amp; Demurrage Collar</span>
            <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
              Demurrage capped at $18,500/day for Panamax / $24,500/day for Capesize with 72 hours NOR notice allowance and Virtual Arrival speed reduction credit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
