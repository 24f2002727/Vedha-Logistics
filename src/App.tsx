import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { MarketTicker } from './components/layout/MarketTicker';
import { HeroBanner } from './components/layout/HeroBanner';
import { FreightForecastDashboard } from './components/forecasting/FreightForecastDashboard';
import { MarketTimingAdvisor } from './components/forecasting/MarketTimingAdvisor';
import { VesselOptimizerTool } from './components/optimization/VesselOptimizerTool';
import { COAContractPlanner } from './components/contracts/COAContractPlanner';
import { InteractiveMaritimeMap } from './components/map/InteractiveMaritimeMap';
import { PortCongestionMonitor } from './components/alerts/PortCongestionMonitor';
import { PortConstraintsViewer } from './components/optimization/PortConstraintsViewer';
import { Footer } from './components/layout/Footer';
import { RequestDemoModal } from './components/modals/RequestDemoModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { VesselType } from './types/maritime';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('intelligence');
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
  };

  const handleSelectCOA = (vesselType: VesselType, volume: number) => {
    setCoaVessel(vesselType);
    setCoaVolume(volume * 6); // 6-voyage volume
    setActiveTab('coa-planner');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Top Live Baltic Indices Ticker */}
      <MarketTicker />

      {/* Main Navigation Header (Veson Nautical & Kepler Style) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestDemo={() => setIsDemoModalOpen(true)}
        onExportReport={() => setIsExportModalOpen(true)}
      />

      {/* Hero Banner with Instant Route Analyzer */}
      <HeroBanner
        onQuickSimulate={handleQuickSimulate}
        onExploreCOA={() => setActiveTab('coa-planner')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Tab 1: AI Freight Rate Forecasting & Market Timing */}
        {activeTab === 'intelligence' && (
          <div className="space-y-12">
            <FreightForecastDashboard />
            <MarketTimingAdvisor onActionClick={() => setActiveTab('coa-planner')} />
          </div>
        )}

        {/* Tab 2: Vessel Selection & Port Constraints Engine */}
        {activeTab === 'optimizer' && (
          <div>
            <VesselOptimizerTool
              initialOrigin={optimizerOrigin}
              initialDest={optimizerDest}
              initialVolume={optimizerVolume}
              onSelectCOA={handleSelectCOA}
            />
          </div>
        )}

        {/* Tab 3: Multi-Voyage COA Transition Engine */}
        {activeTab === 'coa-planner' && (
          <div>
            <COAContractPlanner
              initialVessel={coaVessel}
              initialVolume={coaVolume}
              onExportReport={() => setIsExportModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Interactive Global Maritime Route Map */}
        {activeTab === 'maritime-map' && (
          <div>
            <InteractiveMaritimeMap />
          </div>
        )}

        {/* Tab 5: Port Congestion Radar & Demurrage Early Warnings */}
        {activeTab === 'congestion' && (
          <div>
            <PortCongestionMonitor />
          </div>
        )}

        {/* Tab 6: Full Port Constraints Database */}
        {activeTab === 'port-db' && (
          <div>
            <PortConstraintsViewer />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onRequestDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Modals */}
      <RequestDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}

export default App;
