import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  Fuel,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { BALTIC_INDICES_HISTORY_AND_FORECAST } from '../../data/freightRatesData';
import { BalticIndexType, CurrencyType } from '../../types/maritime';
import { formatRatePerMT, formatCurrency } from '../../utils/currencyUtils';

interface FreightForecastDashboardProps {
  currency?: CurrencyType;
  onNavigateToContracts?: () => void;
}

export const FreightForecastDashboard: React.FC<FreightForecastDashboardProps> = ({
  currency = 'USD',
  onNavigateToContracts
}) => {
  const [selectedIndex, setSelectedIndex] = useState<BalticIndexType>('BCI');
  const [bunkerPrice, setBunkerPrice] = useState<number>(580); // $/ton
  const [demandFactor, setDemandFactor] = useState<number>(1.0); // 0.8 to 1.2
  const [forecastHorizon, setForecastHorizon] = useState<'30' | '60' | '90' | '180'>('90');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const rawData = BALTIC_INDICES_HISTORY_AND_FORECAST[selectedIndex] || BALTIC_INDICES_HISTORY_AND_FORECAST['BDI'];

  // Apply sensitivity multiplier to forecast
  const chartData = rawData.map((d, index) => {
    const isHistorical = !!d.historical;
    const bunkerImpact = (bunkerPrice - 580) * 0.4;
    const adjustedForecast = isHistorical ? d.forecast : Math.round((d.forecast + bunkerImpact) * demandFactor);
    const adjustedLower = isHistorical ? d.confidenceLower : Math.round((d.confidenceLower + bunkerImpact * 0.8) * demandFactor);
    const adjustedUpper = isHistorical ? d.confidenceUpper : Math.round((d.confidenceUpper + bunkerImpact * 1.2) * demandFactor);

    return {
      ...d,
      isHistorical,
      adjustedForecast,
      adjustedLower,
      adjustedUpper,
      index
    };
  });

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const minVal = Math.min(...chartData.map(d => d.adjustedLower)) * 0.85;
  const maxVal = Math.max(...chartData.map(d => d.adjustedUpper)) * 1.1;

  const getX = (i: number) => padding.left + (i / (chartData.length - 1)) * (svgWidth - padding.left - padding.right);
  const getY = (val: number) => svgHeight - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (svgHeight - padding.top - padding.bottom);

  // Split history vs forecast points
  const historyPoints = chartData.filter(d => d.isHistorical);
  const forecastPoints = chartData.filter(d => !d.isHistorical);

  // Create paths
  const historyPath = historyPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.index)} ${getY(d.adjustedForecast)}`).join(' ');

  // Bridge history to forecast
  const lastHistory = historyPoints[historyPoints.length - 1];
  const forecastPath = [
    `M ${getX(lastHistory.index)} ${getY(lastHistory.adjustedForecast)}`,
    ...forecastPoints.map(d => `L ${getX(d.index)} ${getY(d.adjustedForecast)}`)
  ].join(' ');

  // Confidence area path (forecast only)
  const confidencePointsUpper = [
    `M ${getX(lastHistory.index)} ${getY(lastHistory.adjustedForecast)}`,
    ...forecastPoints.map(d => `L ${getX(d.index)} ${getY(d.adjustedUpper)}`)
  ];
  const confidencePointsLower = [
    ...forecastPoints.slice().reverse().map(d => `L ${getX(d.index)} ${getY(d.adjustedLower)}`),
    `L ${getX(lastHistory.index)} ${getY(lastHistory.adjustedForecast)}`
  ];
  const confidenceBandPath = [...confidencePointsUpper, ...confidencePointsLower, 'Z'].join(' ');

  const currentIndexVal = chartData[historyPoints.length - 1]?.adjustedForecast || 2000;
  const forwardTargetIdx = forecastHorizon === '30' ? historyPoints.length :
    forecastHorizon === '60' ? historyPoints.length + 1 :
      forecastHorizon === '90' ? historyPoints.length + 2 : historyPoints.length + 5;
  const forwardTargetVal = chartData[forwardTargetIdx]?.adjustedForecast || 2280;
  const rateChangePct = +(((forwardTargetVal - currentIndexVal) / currentIndexVal) * 100).toFixed(1);

  // Approximate landed freight $/MT and TCE conversion
  const landedSpotRateUSD = selectedIndex === 'BCI' ? 18.50 : selectedIndex === 'BPI' ? 14.80 : 12.60;
  const landedForwardRateUSD = +(landedSpotRateUSD * (1 + rateChangePct / 100)).toFixed(2);
  const impliedTCEUSDDay = selectedIndex === 'BCI' ? Math.round(24600 * (1 + rateChangePct / 100)) :
    selectedIndex === 'BPI' ? Math.round(15200 * (1 + rateChangePct / 100)) : Math.round(13500 * (1 + rateChangePct / 100));

  // Clear AI Recommendation Summary
  let recommendation = {
    action: 'LOCK 6-MONTH COA NOW',
    badgeTone: 'emerald',
    reason: `Freight rates are projected to surge +${rateChangePct}% over the next ${forecastHorizon} days due to Q4 industrial restocking. Locking forward contracts hedges against spot peaks.`,
    targetWindow: 'Laycan Window: 15 Sep – 10 Oct 2026'
  };

  if (rateChangePct <= -3) {
    recommendation = {
      action: 'WAIT / USE SPOT BUFFER',
      badgeTone: 'amber',
      reason: `Freight rates are softening (${rateChangePct}% change). Delaying fixed contracts and utilizing spot voyages will lower procurement spend.`,
      targetWindow: 'Execution Window: Defer 2–4 Weeks'
    };
  } else if (rateChangePct < 5) {
    recommendation = {
      action: 'MONITOR MARKET TRENDS',
      badgeTone: 'blue',
      reason: `Rates are moving within a stable corridor (±3%). Maintain standard staggered quarterly liftings.`,
      targetWindow: 'Standard Laycan Windows'
    };
  }

  return (
    <div className="space-y-8">
      {/* Header Info & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Freight Forecaster & Market Advisor
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                AI Forecast
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Historical actuals and 180-day forward trajectory.
            </p>
          </div>
        </div>

        {/* Index Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-stretch lg:self-auto justify-center">
          {(['BCI', 'BPI', 'BSI', 'BDI'] as BalticIndexType[]).map(idx => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${selectedIndex === idx
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {idx === 'BCI' ? 'Capesize (BCI)' : idx === 'BPI' ? 'Panamax (BPI)' : idx === 'BSI' ? 'Supramax (BSI)' : 'Composite (BDI)'}
            </button>
          ))}
        </div>
      </div>

      {/* Clear AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-orange-950/30 p-6 rounded-2xl border border-slate-800 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              AI Recommendation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Horizon:</span>
            <div className="flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              {(['30', '60', '90', '180'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setForecastHorizon(h)}
                  className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded cursor-pointer ${forecastHorizon === h ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  +{h}d
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-orange-500/20 text-orange-300 border border-orange-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{recommendation.action}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {recommendation.reason}
            </p>
            <div className="text-xs font-mono text-emerald-400 font-semibold pt-0.5">
              📅 {recommendation.targetWindow}
            </div>
          </div>

          {onNavigateToContracts && (
            <button
              onClick={onNavigateToContracts}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shrink-0 cursor-pointer transition-all"
            >
              Model COA Contract
            </button>
          )}
        </div>
      </div>

      {/* 5 Executive KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Current Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Current Spot Rate</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatRatePerMT(landedSpotRateUSD, currency)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Index: {currentIndexVal} pts</span>
        </div>

        {/* Forecast Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Forecast ({forecastHorizon}d)</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatRatePerMT(landedForwardRateUSD, currency)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Projected: {forwardTargetVal} pts</span>
        </div>

        {/* Expected Change */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Expected Delta</span>
          <div className={`text-xl font-bold font-mono mt-1 flex items-center gap-1 ${rateChangePct >= 0 ? 'text-orange-600' : 'text-emerald-600'
            }`}>
            {rateChangePct >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{rateChangePct >= 0 ? `+${rateChangePct}%` : `${rateChangePct}%`}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{rateChangePct >= 0 ? 'Bullish Pressure' : 'Bearish Drop'}</span>
        </div>

        {/* Implied TCE Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Implied TCE Earnings</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            ${impliedTCEUSDDay.toLocaleString()}/d
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Time Charter Equiv.</span>
        </div>

        {/* Confidence Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Model Confidence</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
            92.4%
          </div>
          <span className="text-[10px] text-slate-500 font-medium">95% Confidence Corridor</span>
        </div>
      </div>

      {/* Main Interactive Time-Series SVG Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900">
              {selectedIndex} Trajectory & Confidence Area
            </h3>
            <p className="text-xs text-slate-500">
              Historical actuals vs. forward AI forecast.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-slate-900"></span>
              <span className="text-slate-600 font-medium">Historical Actuals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-orange-500 border-b border-dashed border-orange-500"></span>
              <span className="text-orange-600 font-bold">AI Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></span>
              <span className="text-slate-500">95% Band</span>
            </div>
          </div>
        </div>

        {/* SVG Visualization Container */}
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] overflow-visible font-sans select-none"
          >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const yVal = minVal + pct * (maxVal - minVal);
              const yPos = getY(yVal);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={svgWidth - padding.right}
                    y2={yPos}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {Math.round(yVal)}
                  </text>
                </g>
              );
            })}

            {/* Confidence Area Band */}
            <path
              d={confidenceBandPath}
              fill="#FFEDD5"
              fillOpacity="0.5"
            />

            {/* Historical Solid Line */}
            <path
              d={historyPath}
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Forecast Dashed Line */}
            <path
              d={forecastPath}
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points & Interactive Hover Circles */}
            {chartData.map((d, i) => {
              const xPos = getX(i);
              const yPos = getY(d.adjustedForecast);
              const isHovered = hoveredPoint === i;

              return (
                <g key={i} className="cursor-pointer">
                  {/* Point circle */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isHovered ? 6 : d.isHistorical ? 3.5 : 4}
                    fill={d.isHistorical ? '#0F172A' : '#F97316'}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* X Axis Month Labels */}
                  {(i % 2 === 0 || i === chartData.length - 1) && (
                    <text
                      x={xPos}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      className={`text-[9px] font-mono ${d.isHistorical ? 'fill-slate-500' : 'fill-orange-600 font-bold'
                        }`}
                    >
                      {d.month.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Point Inspection Callout */}
        {hoveredPoint !== null && chartData[hoveredPoint] && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="font-bold text-slate-900 font-sans mr-2">
                {chartData[hoveredPoint].month} ({chartData[hoveredPoint].isHistorical ? 'Historical' : 'Forecast'}):
              </span>
              <span className="text-orange-600 font-extrabold text-sm mr-4">
                {chartData[hoveredPoint].adjustedForecast} pts
              </span>
              <span className="text-slate-500">
                Range: {chartData[hoveredPoint].adjustedLower} – {chartData[hoveredPoint].adjustedUpper} pts
              </span>
            </div>
            <div className="text-slate-600 font-sans text-[11px] italic">
              📌 {chartData[hoveredPoint].driverNotes}
            </div>
          </div>
        )}
      </div>

      {/* Sensitivity Parameter Sliders */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bunker Fuel Price Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-orange-500" />
              Bunker Sensitivity
            </span>
            <span className="font-mono text-orange-600 font-extrabold">${bunkerPrice} / MT</span>
          </div>
          <input
            type="range"
            min="450"
            max="750"
            step="10"
            value={bunkerPrice}
            onChange={(e) => setBunkerPrice(Number(e.target.value))}
            className="w-full accent-orange-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono font-semibold">
            <span>$450 (Low Crude)</span>
            <span>$580 (Current Baseline)</span>
            <span>$750 (Crude Spike)</span>
          </div>
        </div>

        {/* Global Demand Multiplier Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-600" />
              Demand Multiplier
            </span>
            <span className="font-mono text-cyan-700 font-extrabold">{(demandFactor * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.80"
            max="1.25"
            step="0.05"
            value={demandFactor}
            onChange={(e) => setDemandFactor(Number(e.target.value))}
            className="w-full accent-cyan-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono font-semibold">
            <span>80% (Industrial Slowdown)</span>
            <span>100% (Normal Baseline)</span>
            <span>125% (Stimulus Surge)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
