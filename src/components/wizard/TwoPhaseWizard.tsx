import React, { useState } from 'react';
import {
  Ship,
  MapPin,
  Anchor,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  FileText,
  Download,
  Share2,
  Check,
  Fuel,
  Leaf,
  Waves,
  Calendar,
  DollarSign
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS, ALL_PORTS } from '../../data/portsData';
import { VESSEL_CLASSES } from '../../data/vesselData';
import { BALTIC_INDICES_HISTORY_AND_FORECAST } from '../../data/freightRatesData';
import { CommodityType, VesselType, CurrencyType } from '../../types/maritime';
import { calculateVesselFeasibility } from '../../utils/vesselOptimizer';
import { calculateVirtualArrival } from '../../utils/virtualArrival';
import { formatCurrency, formatRatePerMT } from '../../utils/currencyUtils';

interface TwoPhaseWizardProps {
  currency?: CurrencyType;
  onNavigateTab?: (tabId: string) => void;
}

export const TwoPhaseWizard: React.FC<TwoPhaseWizardProps> = ({
  currency = 'USD',
  onNavigateTab
}) => {
  // Wizard Step State: 1 = Input, 2 = Phase 1 (Asset/Vessel), 3 = Phase 2 (Timing/Congestion)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Inputs
  const [selectedOrigin, setSelectedOrigin] = useState('au-hay');
  const [selectedDest, setSelectedDest] = useState('in-par');
  const [cargoVolume, setCargoVolume] = useState<number>(150000); // Default Capesize
  const [commodity, setCommodity] = useState<CommodityType>('Coking Coal');
  const [bunkerPrice] = useState<number>(580);

  // Phase 1 Overrides / Selected Vessel
  const [selectedVesselType, setSelectedVesselType] = useState<VesselType>('Capesize');

  // Phase 2 Fine-Tuning
  const [steamingSpeed, setSteamingSpeed] = useState<number>(12.0); // Eco-steaming speed
  const [contractMode, setContractMode] = useState<'Spot' | '3M_COA' | '6M_COA' | 'TimeCharter'>('6M_COA');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Run Phase 1 Feasibility Calculation across all 6 vessel classes
  const { results, recommendedVessel, originPort, destPort, route } = calculateVesselFeasibility({
    originPortId: selectedOrigin,
    destinationPortId: selectedDest,
    cargoVolumeMT: cargoVolume,
    commodity,
    targetLaycanStart: '2026-10-15',
    targetLaycanEnd: '2026-10-25',
    contractHorizonMonths: contractMode === '6M_COA' ? 6 : contractMode === '3M_COA' ? 3 : 1,
    bunkerPriceSensitivityUSD: bunkerPrice
  });

  // Automatically sync initial recommended vessel when calculations run
  const activeVesselResult = results.find(r => r.vesselType === selectedVesselType) || recommendedVessel || results[0];
  const activeVesselSpec = VESSEL_CLASSES.find(v => v.type === activeVesselResult.vesselType) || VESSEL_CLASSES[5];

  // Run Phase 2 Virtual Arrival & Timing Solver
  const distanceNM = route?.distanceNauticalMiles || 5400;
  const destinationPortObj = ALL_PORTS.find(p => p.id === selectedDest) || ALL_PORTS[0];
  const portQueueDays = destinationPortObj?.avgWaitingDays || 3.8;

  const virtualArrivalRes = calculateVirtualArrival({
    vesselType: activeVesselResult.vesselType,
    distanceNM,
    originalSpeedKts: activeVesselSpec.ladenSpeedKnots,
    optimizedSpeedKts: steamingSpeed,
    knownPortDelayDays: portQueueDays,
    vlsfoPriceUSD: bunkerPrice
  });

  // Baltic Index Data Lookup
  const relevantIndex = activeVesselResult.vesselType === 'Capesize' ? 'BCI' :
    activeVesselResult.vesselType === 'Panamax' || activeVesselResult.vesselType === 'Kamsarmax' ? 'BPI' : 'BSI';
  const forecastSeries = BALTIC_INDICES_HISTORY_AND_FORECAST[relevantIndex] || BALTIC_INDICES_HISTORY_AND_FORECAST['BDI'];
  const upcomingTrough = forecastSeries[16] || forecastSeries[forecastSeries.length - 1]; // Next month forecast

  // Handlers
  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (recommendedVessel) {
      setSelectedVesselType(recommendedVessel.vesselType);
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVesselRow = (type: VesselType) => {
    setSelectedVesselType(type);
  };

  const handleProceedToPhase2 = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopySummary = () => {
    const text = `
VEDHA LOGISTICS — AI CHARTERING DIRECTIVE
--------------------------------------------
Route: ${originPort?.name} (${originPort?.country}) → ${destPort?.name} (India)
Commodity: ${commodity} | Cargo: ${cargoVolume.toLocaleString()} MT
Recommended Vessel: ${activeVesselResult.vesselType.toUpperCase()} BULKER
Landed Freight: $${activeVesselResult.effectiveFreightPerTonUSD.toFixed(2)}/MT (${formatRatePerMT(activeVesselResult.effectiveFreightPerTonUSD, 'INR')})
Total Spend: ${formatCurrency(activeVesselResult.totalVoyageSpendUSD, currency)}
Lightering: ${activeVesselResult.requiresLighterage ? `${activeVesselResult.lighterageVolumeMT?.toLocaleString()} MT at ${activeVesselResult.lighterageLocation} ($${activeVesselResult.lighterageCostUSDPerTon}/t)` : 'Direct Berthing'}

TIMING & CONGESTION TELEMETRY:
- Expected Round Voyage: ${activeVesselResult.totalVoyageDays} Days
- Port Congestion (Queue): ${portQueueDays} Days Waiting at ${destPort?.name}
- Baltic Signal (${relevantIndex}): ${upcomingTrough.driverNotes} (Forecast: ${upcomingTrough.forecast} pts)
- Optimal Laycan Window: Oct 18 – Oct 24, 2026 (Spring Tide High Water)
- Virtual Arrival Speed: ${steamingSpeed} kts (Fuel Saved: ${virtualArrivalRes.savings.fuelSavedMT} MT VLSFO, Demurrage Saved: $${virtualArrivalRes.savings.demurrageSavedUSD.toLocaleString()})
--------------------------------------------
Generated via Vedha Logistics AI Platform
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="space-y-6">

      {/* Progress Wizard Breadcrumbs Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Step 1 Pill */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 text-xs font-bold font-sans transition-colors cursor-pointer ${
              currentStep === 1
                ? 'text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
              currentStep === 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              1
            </span>
            <span className="hidden sm:inline">Route &amp; Parcel</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          {/* Step 2 Pill */}
          <button
            onClick={() => { if (currentStep >= 2) setCurrentStep(2); }}
            disabled={currentStep < 2}
            className={`flex items-center gap-2 text-xs font-bold font-sans transition-colors ${
              currentStep === 2
                ? 'text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 cursor-pointer'
                : currentStep > 2
                ? 'text-slate-700 hover:text-slate-900 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
              currentStep === 2
                ? 'bg-orange-500 text-white'
                : currentStep > 2
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span>Phase 1: Best Vessel &amp; Route</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          {/* Step 3 Pill */}
          <button
            disabled={currentStep < 3}
            className={`flex items-center gap-2 text-xs font-bold font-sans transition-colors ${
              currentStep === 3
                ? 'text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
              currentStep === 3 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </span>
            <span>Phase 2: Timing &amp; Congestion</span>
          </button>
        </div>

        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(1)}
            className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
          >
            Reset Analysis
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: INPUT PARAMETERS (Home Corridor Solver) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Intelligent 2-Phase Chartering Pipeline
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
                Configure Voyage Parameters
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              East Coast India Physical Constraints Active
            </span>
          </div>

          <form onSubmit={handleStartAnalysis} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Origin Port */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Origin Load Port
                </label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                >
                  {GLOBAL_ORIGIN_PORTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Port */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-sky-600" /> Discharge Port (India)
                </label>
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white transition-colors cursor-pointer"
                >
                  {EAST_COAST_INDIAN_PORTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Max Draft: {p.maxDraft}m)
                    </option>
                  ))}
                </select>
              </div>

              {/* Commodity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" /> Cargo Commodity
                </label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value as CommodityType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-600 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="Coking Coal">Coking Coal</option>
                  <option value="Thermal Coal">Thermal Coal</option>
                  <option value="Iron Ore">Iron Ore</option>
                  <option value="Limestone">Limestone</option>
                  <option value="Bauxite">Bauxite</option>
                </select>
              </div>

              {/* Cargo Volume / Capesize Preset */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Parcel Volume</span>
                  <span className="font-mono text-orange-600 font-extrabold">{cargoVolume.toLocaleString()} MT</span>
                </div>
                <select
                  value={cargoVolume}
                  onChange={(e) => setCargoVolume(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer font-mono"
                >
                  <option value={35000}>35,000 MT (Handysize)</option>
                  <option value={55000}>55,000 MT (Supramax)</option>
                  <option value={63500}>63,500 MT (Ultramax)</option>
                  <option value={75000}>75,000 MT (Panamax)</option>
                  <option value={82000}>82,000 MT (Kamsarmax)</option>
                  <option value={150000}>150,000 MT (Capesize Standard)</option>
                  <option value={180000}>180,000 MT (Capesize Full Intake)</option>
                </select>
              </div>

            </div>

            {/* Run Analysis Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Runs full Under-Keel Clearance, STS Lightering, and Baltic Time-Series synchronization.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Run Intelligent Voyage Analysis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: PHASE 1 — VESSEL & ROUTE OPTIMIZATION */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* TOP HERO AI RECOMMENDATION CARD */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950/40 p-6 sm:p-8 rounded-3xl border border-slate-800 text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Phase 1 AI Recommendation
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {originPort?.name} ({originPort?.country}) → {destPort?.name} (India)
                </span>
              </div>

              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                Feasibility Score: {activeVesselResult.feasibilityScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {activeVesselResult.vesselType.toUpperCase()} BULKER
                  </h3>
                  <span className="text-xs text-slate-300 font-mono">
                    (~{activeVesselSpec.typicalDwt.toLocaleString()} DWT)
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeVesselResult.isRecommended
                    ? `Highest-yield vessel class for ${cargoVolume.toLocaleString()} MT ${commodity}. Delivers optimal freight economy while managing port draft constraints.`
                    : `Custom vessel selected by user (${activeVesselResult.vesselType}). Evaluating operational draft and lighterage requirements.`}
                </p>

                {/* Draft / Lighterage Notice */}
                {activeVesselResult.requiresLighterage ? (
                  <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Mandatory STS Lighterage Required: </span>
                      <span>
                        Vessel draft ({activeVesselSpec.typicalDraft}m) exceeds {destPort?.name} limit ({destPort?.maxDraft}m).{' '}
                        {activeVesselResult.lighterageVolumeMT?.toLocaleString()} MT will be lightered at {activeVesselResult.lighterageLocation} ($4.20/MT tariff).
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct Deepwater Berthing Approved (Safe Under-Keel Clearance: +{activeVesselResult.draftMargin}m).</span>
                  </div>
                )}
              </div>

              {/* Metric Readout Cards (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Landed Freight</span>
                  <span className="text-lg font-black text-orange-400">
                    ${activeVesselResult.effectiveFreightPerTonUSD.toFixed(2)}/MT
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {formatRatePerMT(activeVesselResult.effectiveFreightPerTonUSD, 'INR')}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Total Voyage Cost</span>
                  <span className="text-lg font-black text-emerald-400">
                    {formatCurrency(activeVesselResult.totalVoyageSpendUSD, currency)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Includes bunker + lightering
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Draft Margin</span>
                  <span className={`text-base font-extrabold ${activeVesselResult.draftMargin >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {activeVesselResult.draftMargin >= 0 ? `+${activeVesselResult.draftMargin}m (Safe)` : `${activeVesselResult.draftMargin}m (Lightering)`}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Round Voyage</span>
                  <span className="text-base font-extrabold text-white">
                    {activeVesselResult.totalVoyageDays} Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 6-VESSEL FLEET & ROUTE ALTERNATIVES TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-display font-bold text-slate-900">
                  Full 6-Vessel Fleet Intakes &amp; Landed Cost Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Click on any vessel row below to manually override the AI recommendation before proceeding.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                Discharge: {destPort?.name} (Draft: {destPort?.maxDraft}m)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50 font-sans font-semibold">
                    <th className="py-3 px-3">Vessel Class</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Intake</th>
                    <th className="py-3 px-3">Draft Margin</th>
                    <th className="py-3 px-3">STS Lighterage</th>
                    <th className="py-3 px-3">Landed Rate ($/MT)</th>
                    <th className="py-3 px-3">Total Spend</th>
                    <th className="py-3 px-3 text-right">Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((res) => {
                    const spec = VESSEL_CLASSES.find(v => v.type === res.vesselType)!;
                    const isSelected = selectedVesselType === res.vesselType;

                    return (
                      <tr
                        key={res.vesselType}
                        onClick={() => handleSelectVesselRow(res.vesselType)}
                        className={`hover:bg-orange-50/50 transition-all cursor-pointer ${
                          isSelected ? 'bg-orange-50/70 ring-1 ring-orange-400 font-bold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 font-sans font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{res.vesselType}</span>
                            {res.isRecommended && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500 text-white font-mono font-bold">
                                BEST
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold inline-flex items-center gap-1 ${
                            res.status === 'PASSED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : res.status === 'RESTRICTED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {res.status === 'PASSED' && <CheckCircle2 className="w-3 h-3" />}
                            {res.status === 'RESTRICTED' && <AlertTriangle className="w-3 h-3" />}
                            {res.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                            <span>{res.status === 'PASSED' ? 'PASSED' : res.status === 'RESTRICTED' ? 'LIGHTERING' : 'REJECTED'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-800">
                          {(spec.typicalDwt * 0.95).toLocaleString()} MT
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={res.draftMargin >= 0 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                            {res.draftMargin >= 0 ? `+${res.draftMargin}m` : `${res.draftMargin}m`}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600">
                          {res.requiresLighterage && res.lighterageVolumeMT ? (
                            <span className="text-amber-700 font-bold">
                              {res.lighterageVolumeMT.toLocaleString()} MT (+${res.lighterageCostUSDPerTon.toFixed(2)}/t)
                            </span>
                          ) : (
                            <span className="text-slate-400">Direct Berth</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          ${res.effectiveFreightPerTonUSD.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-3 text-slate-800">
                          {formatCurrency(res.totalVoyageSpendUSD, currency)}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Route Parameters</span>
              </button>

              <button
                onClick={handleProceedToPhase2}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Phase 2: Timing &amp; Congestion</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: PHASE 2 — TIMING, PORT CONGESTION & FINAL DIRECTIVE */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* TOP CONSOLIDATED TIMING & CONGESTION DIRECTIVE */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950/40 p-6 sm:p-8 rounded-3xl border border-slate-800 text-white shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Phase 2 Temporal &amp; Congestion Engine
                </span>
                <span className="text-xs text-slate-300 font-mono font-bold">
                  {activeVesselResult.vesselType.toUpperCase()} BULKER @ ${activeVesselResult.effectiveFreightPerTonUSD.toFixed(2)}/MT
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied' : 'Share Plan'}</span>
                </button>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export Directive</span>
                </button>
              </div>
            </div>

            {/* Hierarchical Readout Grid: Expected Days -> Port Congestion -> Baltic Signal -> Tidal Window */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Expected Voyage Days */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">1. Expected Turnaround</span>
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-display font-extrabold text-white">
                  {activeVesselResult.totalVoyageDays} Days
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  {Math.round(distanceNM / (steamingSpeed * 24))} Sea Days + {Math.ceil(cargoVolume / (destPort?.cargoHandlingRateTPD || 25000))} Port Days
                </p>
              </div>

              {/* 2. Destination Port Congestion (Queue Days) */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">2. Port Congestion Queue</span>
                  <Anchor className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-display font-extrabold text-amber-400">
                  +{portQueueDays} Days Delay
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Current Anchorage Wait at {destPort?.name} ({destPort?.congestionStatus} Status)
                </p>
              </div>

              {/* 3. Baltic Index Signal */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">3. Baltic Signal ({relevantIndex})</span>
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-display font-extrabold text-emerald-400">
                  {upcomingTrough.forecast} pts
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Rate Trough Active (Save ~$1.80/MT)
                </p>
              </div>

              {/* 4. Optimal Laycan & Tidal Window */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">4. Recommended Laycan</span>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg font-display font-extrabold text-cyan-300">
                  Oct 18 – Oct 24
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Aligned with High-Water Spring Tide (+1.2m)
                </p>
              </div>

            </div>

            {/* Strategic Summary Banner */}
            <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/30 text-xs text-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Optimized Execution Plan:
                </span>
                <p className="text-slate-300 text-[11px]">
                  Fix a <strong className="text-orange-300">{contractMode.replace('_', ' ')}</strong> contract for a <strong className="text-orange-300">{activeVesselResult.vesselType}</strong> during the Oct 18–24 laycan. Steam at <strong className="text-orange-300">{steamingSpeed} knots</strong> to absorb the {portQueueDays}-day queue at {destPort?.name}.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40 shrink-0">
                Net Savings: {formatCurrency(virtualArrivalRes.savings.netFinancialBenefitUSD, currency)}
              </span>
            </div>

          </div>

          {/* INTERACTIVE FINE-TUNING SANDBOX (Virtual Arrival Speed & Contract Strategy) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Panel 1: Virtual Arrival Speed Tuning */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-slate-900">
                      Virtual Arrival Eco-Steaming
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Non-linear cubic physics: F = F₀ · (V/V₀)³
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                  {steamingSpeed} knots
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Cruising Speed Adjustment</span>
                  <span className="font-mono text-teal-700 font-extrabold">{steamingSpeed} kts (Design: {activeVesselSpec.ladenSpeedKnots} kts)</span>
                </div>

                <input
                  type="range"
                  min="10.5"
                  max="14.5"
                  step="0.5"
                  value={steamingSpeed}
                  onChange={(e) => setSteamingSpeed(Number(e.target.value))}
                  className="w-full accent-teal-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Fuel Saved</span>
                    <span className="font-bold text-teal-700">{virtualArrivalRes.savings.fuelSavedMT} MT VLSFO</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Demurrage Saved</span>
                    <span className="font-bold text-slate-900">${virtualArrivalRes.savings.demurrageSavedUSD.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">CO₂ Abated</span>
                    <span className="font-bold text-emerald-700">{virtualArrivalRes.savings.co2SavedMT} MT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Contract Mode Strategy */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-700">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-slate-900">
                      Contract Structure &amp; Horizon
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Hedge Baltic freight volatility
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
                  {contractMode.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Spot', name: 'Spot Voyage', discount: '0% Hedging' },
                  { id: '3M_COA', name: '3-Month COA', discount: '~8.5% Discount' },
                  { id: '6M_COA', name: '6-Month COA', discount: '~13.5% Discount' },
                  { id: 'TimeCharter', name: 'Period Time Charter', discount: 'Fixed Day-Rate' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setContractMode(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      contractMode === m.id
                        ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">{m.name}</span>
                    <span className="text-[10px] font-mono text-orange-600 block">{m.discount}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Navigation */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Modify Vessel Class</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('vessel-optimizer')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Open in Dedicated Workbench
                </button>
              )}

              <button
                onClick={() => setShowExportModal(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Final Charter Plan</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPORT DIRECTIVE MODAL */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold text-slate-900">
                    Official Charter Directive Summary
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    REF: VEDHA-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 font-mono text-xs space-y-2 text-slate-800">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Route:</span>
                <span className="font-bold">{originPort?.name} ({originPort?.country}) → {destPort?.name} (India)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cargo &amp; Volume:</span>
                <span className="font-bold">{cargoVolume.toLocaleString()} MT {commodity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vessel Class:</span>
                <span className="font-bold text-orange-600">{activeVesselResult.vesselType.toUpperCase()} BULKER</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Landed Rate:</span>
                <span className="font-bold text-emerald-700">${activeVesselResult.effectiveFreightPerTonUSD.toFixed(2)}/MT ({formatRatePerMT(activeVesselResult.effectiveFreightPerTonUSD, 'INR')})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Spend:</span>
                <span className="font-bold text-slate-900">{formatCurrency(activeVesselResult.totalVoyageSpendUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lightering Operations:</span>
                <span className="font-bold">{activeVesselResult.requiresLighterage ? `${activeVesselResult.lighterageVolumeMT?.toLocaleString()} MT at ${activeVesselResult.lighterageLocation} ($4.20/t)` : 'Direct Berthing'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Turnaround &amp; Delay:</span>
                <span className="font-bold">{activeVesselResult.totalVoyageDays} Days (incl. {portQueueDays}d Anchorage Queue)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Optimal Laycan:</span>
                <span className="font-bold text-cyan-700">Oct 18 – Oct 24, 2026 (Spring Tide Aligned)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Virtual Arrival Benefit:</span>
                <span className="font-bold text-teal-700">{virtualArrivalRes.savings.fuelSavedMT} MT VLSFO Saved (${virtualArrivalRes.savings.demurrageSavedUSD.toLocaleString()} Demurrage Avoided)</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedSummary ? 'Copied to Clipboard' : 'Copy to Clipboard'}</span>
              </button>

              <button
                onClick={() => {
                  handleCopySummary();
                  setShowExportModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm &amp; Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
