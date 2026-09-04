import React, { useState } from 'react';
import { 
  Compass, 
  Layers,
  Ship,
  Anchor,
  AlertTriangle,
  FileCheck,
  TrendingDown
} from 'lucide-react';
import { WorldSeaRoutesMap } from './WorldSeaRoutesMap';
import { ALL_PORTS, EAST_COAST_INDIAN_PORTS } from '../../data/portsData';
import { TRADE_ROUTES } from '../../data/tradeRoutesData';
import { PortDetails, TradeRoute, VesselType } from '../../types/maritime';

interface InteractiveMaritimeMapProps {
  onLaunchOptimizer?: (originId: string, destId: string, volume: number) => void;
  onLaunchCOA?: (vesselType: VesselType, volume: number) => void;
}

export const InteractiveMaritimeMap: React.FC<InteractiveMaritimeMapProps> = ({
  onLaunchOptimizer,
  onLaunchCOA
}) => {
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute>(TRADE_ROUTES[0]);
  const [selectedPort, setSelectedPort] = useState<PortDetails>(EAST_COAST_INDIAN_PORTS[0]);

  return (
    <div className="space-y-8">
      
      {/* Flagship World Sea Routes Map Viewport (Nautical Chart Theme) */}
      <WorldSeaRoutesMap
        initialSelectedRouteId={selectedRoute.id}
        onSelectRoute={(route) => setSelectedRoute(route)}
        onSelectPort={(port) => setSelectedPort(port)}
        onLaunchOptimizer={onLaunchOptimizer}
        onLaunchCOA={onLaunchCOA}
        isCompactHero={false}
      />

      {/* Corridor Analysis & Port Infrastructure Insights Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Trade Corridor Analytics (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-display font-bold text-slate-900">
                Corridor Economics: {selectedRoute.originPortName} ➔ {selectedRoute.destinationPortName}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {selectedRoute.distanceNauticalMiles.toLocaleString()} NM • ~{selectedRoute.typicalTransitDays} Days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Spot Rate Benchmark</span>
              <span className="text-lg font-mono font-extrabold text-slate-900">
                ${selectedRoute.spotRatePerTonUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ MT</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">High spot volatility exposure</span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200">
              <span className="text-[10px] uppercase font-bold text-orange-700 block">6-Month COA Target</span>
              <span className="text-lg font-mono font-extrabold text-orange-600">
                ${selectedRoute.projected6MoRatePerTonUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ MT</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                Save ${(selectedRoute.spotRatePerTonUSD - selectedRoute.projected6MoRatePerTonUSD).toFixed(2)}/MT (-13.5%)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200">
              <span className="text-[10px] uppercase font-bold text-sky-700 block">12-Month COA Target</span>
              <span className="text-lg font-mono font-extrabold text-sky-700">
                ${selectedRoute.projected12MoRatePerTonUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ MT</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                Save ${(selectedRoute.spotRatePerTonUSD - selectedRoute.projected12MoRatePerTonUSD).toFixed(2)}/MT (-18.5%)
              </span>
            </div>
          </div>

          {/* Navigation & Weather Chokepoint Alerts */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Chokepoints & Cyclone Risk</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedRoute.chokepoints.map((cp, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-semibold">
                  ⚓ {cp}
                </span>
              ))}
              {selectedRoute.cycloneRiskSeason && (
                <span className="px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-800 font-bold">
                  ⛈️ Weather Window: {selectedRoute.cycloneRiskSeason}
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            {onLaunchOptimizer && (
              <button
                onClick={() => onLaunchOptimizer(selectedRoute.originPortId, selectedRoute.destinationPortId, 75000)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-md cursor-pointer transition-all"
              >
                <Ship className="w-4 h-4 text-orange-400" />
                <span>Optimize Vessel for this Route</span>
              </button>
            )}

            {onLaunchCOA && (
              <button
                onClick={() => onLaunchCOA('Panamax', 600000)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md cursor-pointer transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Simulate 600k MT COA</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Port Infrastructure Deep Dive (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-display font-bold text-slate-900">
                Port Focus: {selectedPort.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {selectedPort.code}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Max Permissible Draft:</span>
              <span className="font-mono font-extrabold text-slate-900">{selectedPort.maxDraft} meters</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Max Length Overall (LOA):</span>
              <span className="font-mono font-extrabold text-slate-900">{selectedPort.maxLOA} meters</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Daily Cargo Handling:</span>
              <span className="font-mono font-extrabold text-slate-900">{selectedPort.cargoHandlingRateTPD.toLocaleString()} TPD</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Berth Mechanism:</span>
              <span className="font-semibold text-slate-800">{selectedPort.berthType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Average Waiting Days:</span>
              <span className="font-mono font-extrabold text-amber-600">{selectedPort.avgWaitingDays} Days ({selectedPort.congestionStatus})</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Riverine / Lighterage Need:</span>
              <span className={`font-bold ${selectedPort.isRiverine || selectedPort.requiresLighterageForCapesize ? 'text-rose-600' : 'text-emerald-600'}`}>
                {selectedPort.isRiverine ? 'Yes (STS Sandheads Required)' : 'Direct Berthing Compatible'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
            <p className="font-semibold">{selectedPort.infrastructureNotes}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
