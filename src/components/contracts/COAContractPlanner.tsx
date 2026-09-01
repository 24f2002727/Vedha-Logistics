import React, { useState } from 'react';
import { 
  Layers, 
  TrendingDown, 
  FileCheck, 
  Check, 
  Download
} from 'lucide-react';
import { VESSEL_CLASSES } from '../../data/vesselData';
import { VesselType } from '../../types/maritime';
import { simulateCOAScenarios } from '../../utils/contractSimulator';

interface COAContractPlannerProps {
  initialVessel?: VesselType;
  initialVolume?: number;
  onExportReport: () => void;
}

export const COAContractPlanner: React.FC<COAContractPlannerProps> = ({
  initialVessel = 'Panamax',
  initialVolume = 600000,
  onExportReport
}) => {
  const [selectedVessel, setSelectedVessel] = useState<VesselType>(initialVessel);
  const [annualVolumeMT, setAnnualVolumeMT] = useState<number>(initialVolume);
  const [baseSpotRateUSD, setBaseSpotRateUSD] = useState<number>(18.50);
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // 6-Month COA as default recommended

  const scenarios = simulateCOAScenarios(annualVolumeMT, selectedVessel, baseSpotRateUSD);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Multi-Voyage COA & Contract Transition Engine
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                Spot → COA Optimizer
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Model transitioning from single spot charters to structured 3, 6, and 12-month Contracts of Affreightment (COA).
            </p>
          </div>
        </div>

        <button
          onClick={onExportReport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export COA Term Sheet</span>
        </button>
      </div>

      {/* Interactive Volume & Baseline Parameters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Annual Cargo Volume */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Annual Procurement Volume</span>
            <span className="font-mono text-orange-600 font-extrabold">{annualVolumeMT.toLocaleString()} MT / Year</span>
          </div>
          <input
            type="range"
            min="100000"
            max="3000000"
            step="50000"
            value={annualVolumeMT}
            onChange={(e) => setAnnualVolumeMT(Number(e.target.value))}
            className="w-full accent-orange-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono font-semibold">
            <span>100K MT (Trial)</span>
            <span>1.5M MT (Mid-size)</span>
            <span>3.0M MT (Major Plant)</span>
          </div>
        </div>

        {/* Vessel Class */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Preferred Vessel Class
          </label>
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value as VesselType)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-orange-500 focus:bg-white cursor-pointer"
          >
            {VESSEL_CLASSES.map(v => (
              <option key={v.type} value={v.type}>
                {v.displayName} (~{v.typicalDwt.toLocaleString()} MT intake)
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            Approx. {Math.ceil(annualVolumeMT / (VESSEL_CLASSES.find(v => v.type === selectedVessel)?.typicalDwt || 75000))} voyages per annum.
          </p>
        </div>

        {/* Baseline Spot Rate */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Current Spot Rate Benchmark</span>
            <span className="font-mono text-sky-700 font-extrabold">${baseSpotRateUSD.toFixed(2)} / MT</span>
          </div>
          <input
            type="number"
            step="0.5"
            min="5"
            max="60"
            value={baseSpotRateUSD}
            onChange={(e) => setBaseSpotRateUSD(Math.max(5, Number(e.target.value)))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 font-bold focus:border-sky-500 focus:bg-white"
          />
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            Market freight baseline before volume commitment discounts.
          </p>
        </div>
      </div>

      {/* Comparison Scenarios Grid (Spot vs 3M vs 6M vs 12M COA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((sc, index) => {
          const isSelected = selectedPlan === index;
          const isOptimal = index === 2; // 6-Month COA

          return (
            <div
              key={sc.contractType}
              onClick={() => setSelectedPlan(index)}
              className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between border ${
                isSelected
                  ? 'bg-orange-50/40 border-orange-500 ring-2 ring-orange-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Badge */}
              {isOptimal && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-orange-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                  Recommended Strategy
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase font-mono">{sc.horizon}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>

                <h3 className="text-base font-display font-bold text-slate-900 mb-2">
                  {sc.contractType}
                </h3>

                {/* Freight Rate */}
                <div className="my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Avg. Freight Rate</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 font-mono">
                      ${sc.avgFreightRatePerTonUSD.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">/ MT</span>
                  </div>

                  {sc.savingsPercentage > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{sc.savingsPercentage}% lower than Spot</span>
                    </div>
                  )}
                </div>

                {/* Scenario Metrics */}
                <div className="space-y-2 text-xs text-slate-700 font-mono mb-4">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Total Voyages:</span>
                    <span className="text-slate-900 font-bold">{sc.voyagesCount} Voyages</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Total Spend:</span>
                    <span className="text-slate-900 font-bold">${(sc.totalFreightSpendUSD / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Net Savings:</span>
                    <span className={`font-bold ${sc.projectedSavingsVsSpotUSD > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {sc.projectedSavingsVsSpotUSD > 0 ? `+$${(sc.projectedSavingsVsSpotUSD / 1000).toFixed(0)}k` : '$0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Profile:</span>
                    <span className="text-sky-700 font-bold text-[11px]">{sc.riskExposureLevel}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Timing */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <strong className="text-slate-900 font-bold">Action Window: </strong>
                {sc.recommendedEntryWindow}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Contract Term Sheet & Clauses */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-display font-bold text-slate-900 flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-500" />
            BIMCO Structured COA Contract Terms & Protective Clauses
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Selected: {scenarios[selectedPlan].contractType}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Clause 1: Bunker Indexation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-amber-800 uppercase font-mono">
              1. Bunker Escalation / De-escalation
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scenarios[selectedPlan].bunkerIndexationClause}
            </p>
            <div className="text-[10px] text-slate-500 font-semibold">
              Protects charterer from crude spikes while allowing downward pass-through when prices soften.
            </div>
          </div>

          {/* Clause 2: Laycan & Demurrage Shield */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-sky-800 uppercase font-mono">
              2. Laycan Flexibility & Demurrage Cap
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              10-day laycan nomination window per voyage. Guaranteed demurrage rate cap at <strong>$18,500/day</strong> (vs $32,000/day peak spot exposure).
            </p>
            <div className="text-[10px] text-slate-500 font-semibold">
              Mitigates monsoon and tidal waiting penalties at Paradip, Haldia, and Vizag.
            </div>
          </div>

          {/* Clause 3: Lightering Coverage */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase font-mono">
              3. Sandheads / Haldia Transshipment
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Pre-agreed STS daughter vessel parceling rate of $4.20/MT when mother vessel arrives at Sagar-Sandheads anchorage.
            </p>
            <div className="text-[10px] text-slate-500 font-semibold">
              Eliminates deadweight penalties and offloading disputes in riverine channels.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
