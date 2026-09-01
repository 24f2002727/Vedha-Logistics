import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Layers, 
  Fuel
} from 'lucide-react';
import { BALTIC_INDICES_HISTORY_AND_FORECAST } from '../../data/freightRatesData';
import { TRADE_ROUTES } from '../../data/tradeRoutesData';
import { BalticIndexType } from '../../types/maritime';

export const FreightForecastDashboard: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<BalticIndexType>('BCI');
  const [bunkerPrice, setBunkerPrice] = useState<number>(580); // $/ton
  const [demandFactor, setDemandFactor] = useState<number>(1.0); // 0.8 to 1.2
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
  const forward90dVal = chartData[historyPoints.length + 2]?.adjustedForecast || 2200;
  const rateChangePct = (((forward90dVal - currentIndexVal) / currentIndexVal) * 100).toFixed(1);

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
              Predictive Baltic Indices & Freight Rate Engine
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                ML Ensemble v4.2
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              12-month historical actuals + 180-day probabilistic forward forecasting with 95% confidence bounds.
            </p>
          </div>
        </div>

        {/* Index Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {(['BDI', 'BCI', 'BPI', 'BSI'] as BalticIndexType[]).map((idx) => {
            const labels: Record<BalticIndexType, string> = {
              BDI: 'BDI (Dry Index)',
              BCI: 'BCI (Capesize)',
              BPI: 'BPI (Panamax)',
              BSI: 'BSI (Supramax)',
              BHSI: 'BHSI (Handysize)'
            };
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-orange-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {labels[idx]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart + Sensitivity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Forecast Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selected Benchmark</span>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                  {selectedIndex} Index: {currentIndexVal.toLocaleString()}
                </span>
                <span className={`text-xs font-bold font-mono flex items-center px-2 py-0.5 rounded ${
                  Number(rateChangePct) >= 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
                }`}>
                  {Number(rateChangePct) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                  {rateChangePct}% (90-Day Forward Trend)
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-sky-600 rounded-full inline-block"></span>
                <span className="text-slate-600">Historical Actuals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-orange-500 rounded-full inline-block border-b border-dashed"></span>
                <span className="text-orange-600 font-bold">AI Forecast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 bg-orange-100 border border-orange-300 rounded-xs inline-block"></span>
                <span className="text-slate-600">95% Conf. Range</span>
              </div>
            </div>
          </div>

          {/* SVG Visualizer (Clean Light Maritime Canvas) */}
          <div className="w-full overflow-x-auto bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[650px] select-none"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const val = minVal + ratio * (maxVal - minVal);
                const y = getY(val);
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#64748B"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {Math.round(val)}
                    </text>
                  </g>
                );
              })}

              {/* Forecast Area Divider */}
              <line
                x1={getX(historyPoints.length - 1)}
                y1={padding.top}
                x2={getX(historyPoints.length - 1)}
                y2={svgHeight - padding.bottom}
                stroke="#FF5B26"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={getX(historyPoints.length - 1) + 6}
                y={padding.top + 10}
                fontSize="10"
                fill="#EA580C"
                fontWeight="bold"
                fontFamily="Outfit"
              >
                CURRENT (Sep 2026)
              </text>

              {/* Confidence Band (Forecast) */}
              <path
                d={confidenceBandPath}
                fill="rgba(255, 101, 0, 0.14)"
                stroke="rgba(255, 101, 0, 0.3)"
                strokeWidth="1"
              />

              {/* Historical Line */}
              <path
                d={historyPath}
                fill="none"
                stroke="#0284C7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Forecast Line */}
              <path
                d={forecastPath}
                fill="none"
                stroke="#EA580C"
                strokeWidth="3"
                strokeDasharray="5 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {chartData.map((d, i) => {
                const cx = getX(i);
                const cy = getY(d.adjustedForecast);
                const isHovered = hoveredPoint === i;

                return (
                  <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 7 : (d.isHistorical ? 4 : 4.5)}
                      fill={d.isHistorical ? '#0284C7' : '#EA580C'}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />

                    {/* Month Label on X-axis */}
                    <text
                      x={cx}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={d.isHistorical ? '#475569' : '#C2410C'}
                      fontWeight={d.isHistorical ? '500' : 'bold'}
                      fontFamily="Inter"
                    >
                      {d.month.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Hover / Key Driver Inspector */}
          <div className="mt-4 p-4 rounded-xl bg-orange-50/60 border border-orange-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">
                {hoveredPoint !== null ? chartData[hoveredPoint].month : 'AI Market Insight'}:
              </span>{' '}
              <span className="text-slate-700">
                {hoveredPoint !== null 
                  ? `${chartData[hoveredPoint].driverNotes} | Projected: ${chartData[hoveredPoint].adjustedForecast} pts (Range: ${chartData[hoveredPoint].adjustedLower} - ${chartData[hoveredPoint].adjustedUpper})`
                  : 'Capesize & Panamax rates projected to surge in Q4 due to Indian thermal power replenishments and Australian post-maintenance export peaks.'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Sensitivity Controls & Dynamic Impact (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sensitivity Sliders Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Macroeconomic Sensitivity</h3>
              </div>
              <button 
                onClick={() => { setBunkerPrice(580); setDemandFactor(1.0); }}
                className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
              >
                Reset Default
              </button>
            </div>

            {/* Bunker Price Sensitivity */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" /> VLSFO Bunker ($/Ton)
                </span>
                <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ${bunkerPrice} / MT
                </span>
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
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>$450 (Low Crude)</span>
                <span>$580 (Baseline)</span>
                <span>$750 (Crude Spike)</span>
              </div>
            </div>

            {/* Global Commodity Demand */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" /> Global Demand Multiplier
                </span>
                <span className="font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {Math.round(demandFactor * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.25"
                step="0.05"
                value={demandFactor}
                onChange={(e) => setDemandFactor(Number(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>-20% (Recession)</span>
                <span>Normal (100%)</span>
                <span>+25% (Boom)</span>
              </div>
            </div>

            {/* Resulting Impact Metric */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Forecasted Freight Sensitivity
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                A ${bunkerPrice - 580 > 0 ? `+${bunkerPrice - 580}` : bunkerPrice - 580}/MT shift in bunker fuel shifts voyage freight by{' '}
                <strong className="text-slate-900 font-bold">
                  ${Math.abs((bunkerPrice - 580) * 0.007).toFixed(2)}/MT
                </strong>{' '}
                on Australia-Paradip routes.
              </div>
            </div>
          </div>

          {/* Strategic Market Timing Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Sparkles className="w-4 h-4" /> AI Timing Recommendation
            </div>
            <h4 className="text-base font-display font-bold text-white">Optimal Entry: Q3/Q4 Transition</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Capesize rates are forecasted to peak in Nov-Dec. Locking a <strong className="text-orange-400 font-bold">6-month COA now</strong> secures a 16.5% discount versus forecasted prompt spot rates.
            </p>
          </div>

        </div>

      </div>

      {/* Key Trade Corridors Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-base font-display font-bold text-slate-900">
            Key Corridor Freight Benchmarks ($/Metric Ton)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Direct spot vs 3-month and 6-month multiple voyage contract rates across primary procurement corridors.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase font-mono text-[11px] bg-slate-50">
                <th className="p-3 font-bold">Trade Route</th>
                <th className="p-3 font-bold">Commodity</th>
                <th className="p-3 font-bold">Distance</th>
                <th className="p-3 font-bold">Spot Freight</th>
                <th className="p-3 font-bold">3-Mo Forward</th>
                <th className="p-3 font-bold">6-Mo COA Rate</th>
                <th className="p-3 font-bold text-emerald-700">Projected COA Savings</th>
                <th className="p-3 font-bold">AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {TRADE_ROUTES.slice(0, 6).map((route) => {
                const diff = (route.spotRatePerTonUSD - route.projected6MoRatePerTonUSD).toFixed(2);
                const pct = Math.round(((route.spotRatePerTonUSD - route.projected6MoRatePerTonUSD) / route.spotRatePerTonUSD) * 100);

                return (
                  <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{route.originPortName} → {route.destinationPortName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{route.chokepoints.join(' • ')}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                        {route.defaultCommodity}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-700 font-medium">
                      {route.distanceNauticalMiles.toLocaleString()} NM ({route.typicalTransitDays}d)
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      ${route.spotRatePerTonUSD.toFixed(2)}/t
                    </td>
                    <td className="p-3 font-mono text-amber-700 font-semibold">
                      ${route.projected3MoRatePerTonUSD.toFixed(2)}/t
                    </td>
                    <td className="p-3 font-mono font-bold text-sky-700">
                      ${route.projected6MoRatePerTonUSD.toFixed(2)}/t
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                      -${diff}/t ({pct}%)
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                        Lock COA
                      </span>
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
