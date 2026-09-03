import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { MarketTicker } from './components/layout/MarketTicker';
import { LandingHomePage } from './components/home/LandingHomePage';
import { QuickRouteAnalyzerBar } from './components/optimization/QuickRouteAnalyzerBar';
import { FreightForecastDashboard } from './components/forecasting/FreightForecastDashboard';
import { MarketTimingAdvisor } from './components/forecasting/MarketTimingAdvisor';
import { VesselOptimizerTool } from './components/optimization/VesselOptimizerTool';
import { VirtualArrivalSimulator } from './components/optimization/VirtualArrivalSimulator';
import { COAContractPlanner } from './components/contracts/COAContractPlanner';
import { WorldSeaRoutesMap } from './components/map/WorldSeaRoutesMap';
import { PortCongestionMonitor } from './components/alerts/PortCongestionMonitor';
import { PortConstraintsViewer } from './components/optimization/PortConstraintsViewer';
import { Footer } from './components/layout/Footer';
import { RequestDemoModal } from './components/modals/RequestDemoModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { VesselType, CurrencyType } from './types/maritime';
import { Compass, TrendingUp, Sparkles, Layers, ShieldCheck, Leaf, Ship, AlertTriangle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Cross-component state transfer
  const [optimizerOrigin, setOptimizerOrigin] = useState<string>('au-hay');
  const [optimizerDest, setOptimizerDest] = useState<string>('in-par');
  const [optimizerVolume, setOptimizerVolume] = useState<number>(75000);

  const [coaVessel, setCoaVessel] = useState<VesselType>('Panamax');
  const [coaVolume, setCoaVolume] = useState<number>(600000);

  const handleQuickSimulate = (originId: string, destId: string, volume: number) => {
    setOptimizerOrigin(originId);
    setOptimizerDest(destId);
    setOptimizerVolume(volume);
    setActiveTab('optimizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCOA = (vesselType: VesselType, volume: number) => {
    setCoaVessel(vesselType);
    setCoaVolume(volume * 6); // 6-voyage volume
    setActiveTab('coa-planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Top Live Baltic Indices Ticker */}
      <MarketTicker />

      {/* Main Navigation Header with Currency Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        currency={currency}
        setCurrency={setCurrency}
        onRequestDemo={() => setIsDemoModalOpen(true)}
        onExportReport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Tab 0: Clean, Authentic Logistics Landing Home Page */}
        {activeTab === 'home' && (
          <LandingHomePage
            onNavigateTab={handleNavigateTab}
            onQuickSimulate={handleQuickSimulate}
            currency={currency}
          />
        )}

        {/* Tab 1: Market Timing & AI Forecast */}
        {activeTab === 'intelligence' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Route Feasibility & Draft Matcher */}
            <QuickRouteAnalyzerBar
              defaultOrigin={optimizerOrigin}
              defaultDest={optimizerDest}
              defaultVolume={optimizerVolume}
              onAnalyze={handleQuickSimulate}
            />

            {/* Predictive Freight Forecast Dashboard */}
            <FreightForecastDashboard
              currency={currency}
              onNavigateToContracts={() => handleNavigateTab('coa-planner')}
            />

            {/* Optimal Market Entry Timing Signals */}
            <MarketTimingAdvisor
              onActionClick={() => handleNavigateTab('coa-planner')}
            />
          </div>
        )}

        {/* Tab 2: Vessel & Port Optimizer */}
        {activeTab === 'optimizer' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <VesselOptimizerTool
              key={`${optimizerOrigin}-${optimizerDest}-${optimizerVolume}`}
              initialOrigin={optimizerOrigin}
              initialDest={optimizerDest}
              initialVolume={optimizerVolume}
              currency={currency}
              onSelectCOA={handleSelectCOA}
            />
          </div>
        )}

        {/* Tab 3: Contract & Laycan Strategy (MILP) */}
        {activeTab === 'coa-planner' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <COAContractPlanner
              key={`${coaVessel}-${coaVolume}`}
              initialVessel={coaVessel}
              initialVolume={coaVolume}
              currency={currency}
              onExportReport={() => setIsExportModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Virtual Arrival & Green Steaming (Idle Scenario Management) */}
        {activeTab === 'virtual-arrival' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <VirtualArrivalSimulator
              currency={currency}
              onNavigateToContracts={() => handleNavigateTab('coa-planner')}
            />
          </div>
        )}

        {/* Tab 5: Port Congestion Radar & Risk Monitor */}
        {activeTab === 'congestion' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <PortCongestionMonitor
              currency={currency}
              onNavigateToVirtualArrival={() => handleNavigateTab('virtual-arrival')}
            />
          </div>
        )}

        {/* Tab 6: Global Sea Routes & Map */}
        {activeTab === 'maritime-map' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                    Global Maritime Trade Routes &amp; Chokepoint Map
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Explore major bulk trade corridors linking Australia, US, Indonesia, and Africa to India&apos;s East Coast ports.
                  </p>
                </div>
              </div>
            </div>
            <WorldSeaRoutesMap />
          </div>
        )}

        {/* Tab 7: Port Constraints Database */}
        {activeTab === 'port-db' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <PortConstraintsViewer />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer 
        setActiveTab={handleNavigateTab} 
        onRequestDemo={() => setIsDemoModalOpen(true)} 
      />

      {/* Interactive Modals */}
      <RequestDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        vesselType={coaVessel}
        volumeMT={coaVolume}
      />
    </div>
  );
}

export default App;
