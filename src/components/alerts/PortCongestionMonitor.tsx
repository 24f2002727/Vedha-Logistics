import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  DollarSign,
  CloudRain,
  Activity,
  Zap,
  CheckCircle2,
  Sliders,
  Anchor,
  Compass
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS } from '../../data/portsData';
import { MACRO_SCENARIOS_DATA } from '../../data/freightRatesData';
import { CurrencyType } from '../../types/maritime';
import { formatCurrency } from '../../utils/currencyUtils';

interface PortCongestionMonitorProps {
  currency?: CurrencyType;
  onNavigateToVirtualArrival?: () => void;
}

export const PortCongestionMonitor: React.FC<PortCongestionMonitorProps> = ({
  currency = 'USD',
  onNavigateToVirtualArrival
}) => {
  const [activeShockId, setActiveShockId] = useState<string | null>(null);

  const activeShock = MACRO_SCENARIOS_DATA.find(s => s.id === activeShockId);

  const alerts = [
    {
      id: 'alt-1',
      port: 'Haldia Dock Complex',
      level: 'Severe',
      type: 'Riverine Tidal Delay & Siltation',
      daysDelay: '4.8 Days Average Waiting',
      impact: 'High Demurrage Risk ($18k-$24k/day on spot charters)',
      recommendation: 'Lighter Capesize/Panamax cargo at Sagar-Sandheads or divert to Dhamra/Paradip.'
    },
    {
      id: 'alt-2',
      port: 'Sagar - Sandheads Anchorage',
      level: 'High',
      type: 'Monsoon Sea Swell Alert',
      daysDelay: '3.5 Days Swell Disruption',
      impact: 'STS transshipment crane operations halted during 2.5m+ wave height.',
      recommendation: 'Schedule mother vessel arrival during low swell tide window.'
    },
    {
      id: 'alt-3',
      port: 'Paradip Port (Mechanized Berth)',
      level: 'Moderate',
      type: 'High Berth Occupancy',
      daysDelay: '2.4 Days Queue',
      impact: 'Manageable with 10-day laycan flexibility clause in COA.',
      recommendation: 'Prioritize automated conveyor discharge berths (MCH).'
    },
    {
      id: 'alt-4',
      port: 'Dhamra Port & Gangavaram',
      level: 'Low',
      type: 'Optimal Deepwater Fast Turnaround',
      daysDelay: '1.2 - 1.5 Days',
      impact: 'Zero demurrage risk, high dispatch probability (+ $0.40/MT savings).',
      recommendation: 'Preferred discharge ports for Capesize direct shipments.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Port Congestion & Risk Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold">
                Live Disruption
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time monitoring of port queues, laytime risks, and macro volatility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AIS Telemetry Active</span>
        </div>
      </div>

      {/* Macroeconomic Shock & Disruption Stress Testing */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-orange-950/30 p-6 rounded-2xl border border-slate-800 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              Macro Shock Stress Testing
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Toggle scenario to assess market impact.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MACRO_SCENARIOS_DATA.map((s) => {
            const isSelected = activeShockId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveShockId(isSelected ? null : s.id)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-500 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-orange-400">
                      {isSelected ? 'ACTIVE SHOCK' : 'SIMULATE'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans line-clamp-1">{s.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">{s.description}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] font-mono text-emerald-400 flex justify-between">
                  <span>Capesize: {s.capesizeImpactPercent >= 0 ? `+${s.capesizeImpactPercent}%` : `${s.capesizeImpactPercent}%`}</span>
                  <span>Delay: +{s.congestionDaysDelta}d</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeShock && (
          <div className="bg-orange-950/40 p-4 rounded-xl border border-orange-500/40 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-orange-300">Simulated Impact: </span>
              <span className="text-slate-200">
                Capesize freight rises by {activeShock.capesizeImpactPercent}%, Panamax by {activeShock.panamaxImpactPercent}%, Bunker multiplier: {activeShock.bunkerPriceMultiplier}x, Queue delay increases by +{activeShock.congestionDaysDelta} days.
              </span>
            </div>
            {onNavigateToVirtualArrival && (
              <button
                onClick={onNavigateToVirtualArrival}
                className="px-3 py-1.5 rounded-lg bg-orange-500 text-white font-bold shrink-0 hover:bg-orange-600 transition-all cursor-pointer font-sans"
              >
                Mitigate via Virtual Arrival
              </button>
            )}
          </div>
        )}
      </div>

      {/* East Coast India Ports Queue Benchmarks */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-display font-bold text-slate-900">
            Live Congestion &amp; Queue Benchmarks
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Paradip • Vizag • Gangavaram • Gopalpur • Dhamra • Sagar • Haldia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EAST_COAST_INDIAN_PORTS.map((port) => {
            const isSevere = port.congestionStatus === 'Severe';
            const isHigh = port.congestionStatus === 'High';
            const isMod = port.congestionStatus === 'Moderate';
            const waitingDays = port.avgWaitingDays + (activeShock ? activeShock.congestionDaysDelta : 0);
            const demurrageExposureUSD = Math.round(waitingDays * 19000); // Typical Panamax demurrage

            return (
              <div
                key={port.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSevere
                    ? 'bg-rose-50/50 border-rose-300'
                    : isHigh
                    ? 'bg-amber-50/50 border-amber-300'
                    : isMod
                    ? 'bg-sky-50/40 border-sky-300'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 font-sans">{port.name}</span>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                        isSevere
                          ? 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : isMod
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {port.congestionStatus} Queue
                    </span>
                  </div>

                  <div className="text-2xl font-bold font-mono text-slate-900 mb-1">
                    {waitingDays.toFixed(1)} Days
                  </div>
                  <span className="text-[11px] text-slate-500 block mb-3 font-medium">
                    Max Safe Draft: <strong className="text-slate-700">{port.maxDraft}m</strong> • Rate: <strong className="text-slate-700">{(port.cargoHandlingRateTPD / 1000).toFixed(0)}k TPD</strong>
                  </span>

                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200 text-xs font-mono space-y-1 mb-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Demurrage Risk:</span>
                      <span className="font-bold text-rose-600">{formatCurrency(demurrageExposureUSD, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Monsoon Risk:</span>
                      <span className="font-bold text-slate-800">{port.monsoonSensitivity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 font-sans italic pt-2 border-t border-slate-200/60">
                  {port.infrastructureNotes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disruption Alert Cards & Actionable Playbooks */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Active Alerts &amp; Mitigation Playbooks</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-5 rounded-xl border flex flex-col justify-between ${
                alt.level === 'Severe'
                  ? 'bg-rose-50/40 border-rose-300'
                  : alt.level === 'High'
                  ? 'bg-amber-50/40 border-amber-300'
                  : alt.level === 'Moderate'
                  ? 'bg-sky-50/30 border-sky-300'
                  : 'bg-emerald-50/30 border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 font-sans">{alt.port}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-300">
                    {alt.daysDelay}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-1">{alt.type}</h4>
                <p className="text-xs text-slate-600 mb-3">{alt.impact}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800">
                <strong className="text-orange-600 block mb-0.5">Recommended Action:</strong>
                {alt.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
