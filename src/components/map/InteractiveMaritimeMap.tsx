import React, { useState } from 'react';
import { 
  Compass, 
  Navigation
} from 'lucide-react';
import { EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS, ALL_PORTS } from '../../data/portsData';
import { TRADE_ROUTES } from '../../data/tradeRoutesData';
import { PortDetails } from '../../types/maritime';

export const InteractiveMaritimeMap: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-au-par');
  const [selectedPort, setSelectedPort] = useState<PortDetails | null>(EAST_COAST_INDIAN_PORTS[0]);

  const activeRoute = TRADE_ROUTES.find(r => r.id === selectedRouteId) || TRADE_ROUTES[0];
  const originPort = ALL_PORTS.find(p => p.id === activeRoute.originPortId);
  const destPort = ALL_PORTS.find(p => p.id === activeRoute.destinationPortId);

  // Map coordinate projection to SVG (Mercator-ish viewBox 0 0 1000 500)
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 110) % 360) * (1000 / 360);
    const y = ((65 - lat) / 105) * 500;
    return { x: Math.max(30, Math.min(970, x)), y: Math.max(30, Math.min(470, y)) };
  };

  const chokepoints = [
    { name: 'Malacca Strait', lat: 2.5, lng: 101.5, status: 'Normal', note: 'High Traffic Density' },
    { name: 'Suez Canal & Red Sea', lat: 14.0, lng: 43.5, status: 'Advisory', note: 'Security & War Risk Premium' },
    { name: 'Cape of Good Hope', lat: -34.5, lng: 18.5, status: 'Optimal', note: 'Cape Routing for Deep Draft Bulkers' },
    { name: 'Torres Strait', lat: -10.5, lng: 142.2, status: 'Normal', note: 'Queensland Pilotage Enforced' },
    { name: 'Hooghly River Channel', lat: 21.8, lng: 88.0, status: 'Draft Restricted', note: 'Tidal Limit 7.5m - 8.5m' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Interactive Global Maritime Routing & Choke Point Map
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold">
                Live AIS Corridors
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Visualizing bulk trade lanes, nautical distances, chokepoint risks, and port draft constraints.
            </p>
          </div>
        </div>

        {/* Route Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-600 px-2">Corridor:</span>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="bg-white text-xs font-bold text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            {TRADE_ROUTES.map(r => (
              <option key={r.id} value={r.id}>
                {r.originCountry} → {r.destinationPortName} ({r.distanceNauticalMiles} NM)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map + Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Interactive Map (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">
                Active Corridor: {activeRoute.originPortName} ➔ {activeRoute.destinationPortName}
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              {activeRoute.distanceNauticalMiles.toLocaleString()} NM • Est. {activeRoute.typicalTransitDays} Transit Days
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[16/9] bg-[#0A1628] rounded-xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            
            <svg viewBox="0 0 1000 500" className="w-full h-full select-none">
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>

                <linearGradient id="activeRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5B26" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>

              {/* Grid Canvas */}
              <rect width="1000" height="500" fill="url(#mapGrid)" />

              {/* Stylized Ocean Curvature Lines */}
              <path d="M 50 250 Q 500 180 950 250" fill="none" stroke="rgba(0, 102, 204, 0.15)" strokeWidth="1" strokeDasharray="6 6" />
              <path d="M 50 150 Q 500 80 950 150" fill="none" stroke="rgba(0, 102, 204, 0.12)" strokeWidth="1" strokeDasharray="6 6" />
              <path d="M 50 350 Q 500 280 950 350" fill="none" stroke="rgba(0, 102, 204, 0.12)" strokeWidth="1" strokeDasharray="6 6" />

              {/* Passive Trade Lanes */}
              {TRADE_ROUTES.map((route) => {
                if (route.id === selectedRouteId) return null;
                const oPort = ALL_PORTS.find(p => p.id === route.originPortId);
                const dPort = ALL_PORTS.find(p => p.id === route.destinationPortId);
                if (!oPort || !dPort) return null;

                const start = projectCoords(oPort.coordinates.lat, oPort.coordinates.lng);
                const end = projectCoords(dPort.coordinates.lat, dPort.coordinates.lng);
                const midX = (start.x + end.x) / 2;
                const midY = Math.min(start.y, end.y) - 40;

                return (
                  <path
                    key={route.id}
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="hover:stroke-orange-400 cursor-pointer transition-all"
                    onClick={() => setSelectedRouteId(route.id)}
                  />
                );
              })}

              {/* Active Route Geodesic Curve */}
              {(() => {
                if (!originPort || !destPort) return null;
                const start = projectCoords(originPort.coordinates.lat, originPort.coordinates.lng);
                const end = projectCoords(destPort.coordinates.lat, destPort.coordinates.lng);
                const midX = (start.x + end.x) / 2;
                const midY = Math.min(start.y, end.y) - 60;

                return (
                  <g>
                    <path
                      d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke="url(#activeRouteGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Animated Vessel traversing the path */}
                    <circle
                      cx={(start.x + end.x) / 2}
                      cy={midY + 30}
                      r="6"
                      fill="#FF5B26"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                );
              })()}

              {/* Choke Points */}
              {chokepoints.map((cp, idx) => {
                const pos = projectCoords(cp.lat, cp.lng);
                return (
                  <g key={idx} className="cursor-pointer group">
                    <circle cx={pos.x} cy={pos.y} r="7" fill="rgba(245, 158, 11, 0.25)" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx={pos.x} cy={pos.y} r="2.5" fill="#F59E0B" />
                    <text
                      x={pos.x + 9}
                      y={pos.y + 3}
                      fontSize="9.5"
                      fill="#FBBF24"
                      fontFamily="Outfit"
                      fontWeight="bold"
                    >
                      {cp.name}
                    </text>
                  </g>
                );
              })}

              {/* Global Origin Port Markers */}
              {GLOBAL_ORIGIN_PORTS.map((port) => {
                const pos = projectCoords(port.coordinates.lat, port.coordinates.lng);
                const isSelected = selectedPort?.id === port.id;
                const isRouteOrigin = originPort?.id === port.id;

                return (
                  <g 
                    key={port.id} 
                    onClick={() => setSelectedPort(port)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isRouteOrigin ? 8 : 4.5}
                      fill={isRouteOrigin ? '#FF5B26' : '#38BDF8'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 9}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={isRouteOrigin ? '#FF7A45' : '#E2E8F0'}
                      fontWeight="bold"
                      fontFamily="Inter"
                    >
                      {port.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* East Coast India Port Markers */}
              {EAST_COAST_INDIAN_PORTS.map((port) => {
                const pos = projectCoords(port.coordinates.lat, port.coordinates.lng);
                const isSelected = selectedPort?.id === port.id;
                const isRouteDest = destPort?.id === port.id;

                return (
                  <g 
                    key={port.id} 
                    onClick={() => setSelectedPort(port)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isRouteDest ? 9 : 5.5}
                      fill={isRouteDest ? '#10B981' : '#06B6D4'}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      x={pos.x + 9}
                      y={pos.y + 3}
                      fontSize="9.5"
                      fill={isRouteDest ? '#34D399' : '#CBD5E1'}
                      fontWeight="bold"
                      fontFamily="Outfit"
                    >
                      {port.name.replace(' Port', '')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100 font-medium">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>East Coast Indian Port</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                <span>Global Origin Hub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Strategic Chokepoint</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Click any port or line to inspect</span>
          </div>
        </div>

        {/* Selected Port Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPort ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-orange-600">
                    {selectedPort.region}
                  </span>
                  <h3 className="text-lg font-display font-extrabold text-slate-900">
                    {selectedPort.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedPort.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Max Draft</span>
                  <span className="text-lg font-bold text-sky-700">{selectedPort.maxDraft}m</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Max LOA</span>
                  <span className="text-lg font-bold text-slate-900">{selectedPort.maxLOA}m</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Discharge Rate</span>
                  <span className="text-base font-bold text-emerald-700">
                    {(selectedPort.cargoHandlingRateTPD / 1000).toFixed(0)}k TPD
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Queue Time</span>
                  <span className="text-base font-bold text-amber-700">{selectedPort.avgWaitingDays}d wait</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Berth Configuration:</span>
                  <span className="text-slate-900 font-medium">{selectedPort.berthType}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Permitted Vessel Classes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPort.permittedVesselTypes.map(v => (
                      <span key={v} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-slate-600 leading-relaxed text-[11px]">
                  {selectedPort.description}
                </div>
              </div>
            </div>
          ) : null}

          {/* Active Corridor Backhaul / Triangulation Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4" /> Backhaul & Positioning Strategy
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              After discharging at <strong className="text-white font-bold">{destPort?.name}</strong>, optimize ballasting with recommended backhaul cargo:
            </p>
            <div className="space-y-1.5 pt-1">
              {activeRoute.backhaulOptions.map((opt, i) => (
                <div key={i} className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {opt}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
