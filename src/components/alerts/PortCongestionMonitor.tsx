import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  DollarSign
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS } from '../../data/portsData';

export const PortCongestionMonitor: React.FC = () => {
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Port Congestion Radar & Demurrage Early Warnings
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold">
                Live Disruption Feed
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Track waiting queues, tidal restrictions, monsoon laytime risk, and projected demurrage across East Coast India.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>AIS Queue Updated 10m ago</span>
        </div>
      </div>

      {/* Real-Time East Coast Ports Queue Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-display font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>East Coast India Port Status & Queue Benchmarks</span>
          <span className="text-xs font-mono text-slate-500 font-normal">Paradip • Vizag • Gangavaram • Gopalpur • Dhamra • Sagar • Haldia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EAST_COAST_INDIAN_PORTS.map((port) => {
            const isSevere = port.congestionStatus === 'Severe';
            const isHigh = port.congestionStatus === 'High';
            const isMod = port.congestionStatus === 'Moderate';

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
                    <span className="font-bold text-slate-900 text-sm">{port.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      isSevere ? 'bg-rose-600 text-white' :
                      isHigh ? 'bg-amber-600 text-white' :
                      isMod ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {port.congestionStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 my-3 font-mono bg-white p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg. Waiting:</span>
                      <span className="font-bold text-slate-900">{port.avgWaitingDays} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Draft:</span>
                      <span className="text-sky-700 font-bold">{port.maxDraft}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Discharge TPD:</span>
                      <span className="text-emerald-700 font-bold">{port.cargoHandlingRateTPD.toLocaleString()} MT/d</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monsoon Risk:</span>
                      <span className={`font-bold ${port.monsoonSensitivity === 'High' ? 'text-amber-700' : 'text-slate-700'}`}>
                        {port.monsoonSensitivity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
                  {port.infrastructureNotes.slice(0, 80)}...
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disruption Alerts & Mitigation Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${
                  alert.level === 'Severe' ? 'text-rose-600' :
                  alert.level === 'High' ? 'text-amber-600' :
                  alert.level === 'Moderate' ? 'text-sky-600' : 'text-emerald-600'
                }`} />
                <span className="font-bold text-slate-900 text-sm">{alert.port}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {alert.type}
              </span>
            </div>

            <div className="text-xs text-slate-700 space-y-1">
              <div className="font-mono text-amber-800 font-bold">{alert.daysDelay}</div>
              <p className="text-slate-600 font-medium">{alert.impact}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-emerald-800 block mb-0.5">AI Recommended Mitigation:</span>
              <span className="text-slate-700 font-medium">{alert.recommendation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Demurrage Exposure Calculator Widget */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            Demurrage Protection Under COA Agreements
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Spot charters expose buyers to uncapped demurrage penalties (up to $35,000/day during severe port congestion at Haldia or Paradip). 
            Our structured COA contracts include a <strong>guaranteed demurrage sharing cap</strong>, saving an estimated <strong>$140,000 per delayed voyage</strong>.
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Avg. Demurrage Avoided</span>
          <span className="text-2xl font-display font-extrabold text-emerald-400 font-mono">$1.85 / MT</span>
          <span className="text-[10px] text-slate-400 block">across multi-voyage contracts</span>
        </div>
      </div>
    </div>
  );
};
