import React, { useState } from 'react';
import { 
  Anchor, 
  Search, 
  Filter, 
  MapPin
} from 'lucide-react';
import { ALL_PORTS } from '../../data/portsData';
import { PortDetails } from '../../types/maritime';

export const PortConstraintsViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedPortDetail, setSelectedPortDetail] = useState<PortDetails | null>(null);

  const filteredPorts = ALL_PORTS.filter(port => {
    const matchesSearch = port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'all' || port.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              Global & East Coast India Port Constraints Directory
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono font-bold">
                18 Hubs Indexed
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified nautical infrastructure parameters: maximum permissible drafts, LOA, beam, handling rates (TPD), and lighterage protocols.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search port, code, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-orange-500" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Ports' },
          { id: 'East Coast India', label: 'East Coast India' },
          { id: 'Australia', label: 'Australia' },
          { id: 'United States', label: 'United States' },
          { id: 'Indonesia', label: 'Indonesia' },
          { id: 'Mozambique', label: 'Mozambique' },
          { id: 'Russia', label: 'Russia' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRegion(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedRegion === tab.id
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Ports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[11px]">
                <th className="p-4 font-bold">Port Name & Code</th>
                <th className="p-4 font-bold">Country / Region</th>
                <th className="p-4 font-bold">Max Draft (m)</th>
                <th className="p-4 font-bold">Max LOA & Beam</th>
                <th className="p-4 font-bold">Discharge/Load (TPD)</th>
                <th className="p-4 font-bold">Permitted Vessels</th>
                <th className="p-4 font-bold">Berth Mechanism</th>
                <th className="p-4 font-bold">Congestion Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredPorts.map((port) => {
                const isEastCoast = port.region === 'East Coast India';

                return (
                  <tr 
                    key={port.id} 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setSelectedPortDetail(port)}
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <span>{port.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 ml-5 font-semibold">
                        UN/LOCODE: {port.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        isEastCoast ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {port.country}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-sky-700">
                      {port.maxDraft}m
                      {port.isRiverine && (
                        <span className="block text-[10px] font-sans text-amber-700 font-bold">Tidal River</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-700 font-semibold">
                      {port.maxLOA}m / {port.maxBeam}m
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700">
                      {port.cargoHandlingRateTPD.toLocaleString()} MT/d
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {port.permittedVesselTypes.map(v => (
                          <span key={v} className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-[11px] text-slate-600 font-medium">
                      {port.berthType}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        port.congestionStatus === 'Severe' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        port.congestionStatus === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        port.congestionStatus === 'Moderate' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {port.avgWaitingDays}d ({port.congestionStatus})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Port Modal */}
      {selectedPortDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-display font-bold text-slate-900">
                  {selectedPortDetail.name} ({selectedPortDetail.code})
                </h3>
              </div>
              <button
                onClick={() => setSelectedPortDetail(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Max Draft</span>
                <span className="text-lg font-bold text-sky-700">{selectedPortDetail.maxDraft}m</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Max LOA</span>
                <span className="text-lg font-bold text-slate-900">{selectedPortDetail.maxLOA}m</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Max Beam</span>
                <span className="text-lg font-bold text-slate-900">{selectedPortDetail.maxBeam}m</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Handling TPD</span>
                <span className="text-lg font-bold text-emerald-700">{selectedPortDetail.cargoHandlingRateTPD.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Description:</span>
                <p className="text-slate-700 leading-relaxed font-medium">{selectedPortDetail.description}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Infrastructure & Lighterage Notes:</span>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
                  {selectedPortDetail.infrastructureNotes}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPortDetail(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
