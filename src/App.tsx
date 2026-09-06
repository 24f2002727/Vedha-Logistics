import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { MarketTicker } from './components/layout/MarketTicker';
import { LandingHomePage } from './components/home/LandingHomePage';
import { QuickRouteAnalyzerBar } from './components/optimization/QuickRouteAnalyzerBar';
import { FreightForecastDashboard } from './components/forecasting/FreightForecastDashboard';
import { MarketTimingAdvisor } from './components/forecasting/MarketTimingAdvisor';
import { VesselOptimizerTool } from './components/optimization/VesselOptimizerTool';
import { VirtualArrivalSimulator } from './components/optimization/VirtualArrivalSimulator';
import { PortCongestionMonitor } from './components/alerts/PortCongestionMonitor';
import { Footer } from './components/layout/Footer';
import { VesselType } from './types/maritime';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Cross-component state transfer
  const [optimizerOrigin, setOptimizerOrigin] = useState<string>('au-hay');
  const [optimizerDest, setOptimizerDest] = useState<string>('in-par');
  const [optimizerVolume, setOptimizerVolume] = useState<number>(75000);

  const handleQuickSimulate = (originId: string, destId: string, volume: number) => {
    setOptimizerOrigin(originId);
    setOptimizerDest(destId);
    setOptimizerVolume(volume);
    setActiveTab('vessel-optimizer');
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

      {/* Main Navigation Header (Clean & Focused) */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Tab 0: Problem-Centric Landing Home Page */}
        {activeTab === 'home' && (
          <LandingHomePage
            onNavigateTab={handleNavigateTab}
            onQuickSimulate={handleQuickSimulate}
          />
        )}

        {/* Tab 1: Problem A - Optimal Market Entry Timing */}
        {activeTab === 'market-timing' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Predictive Freight Forecast Dashboard */}
            <FreightForecastDashboard
              currency="USD"
              onNavigateToContracts={() => handleNavigateTab('vessel-optimizer')}
            />

            {/* Optimal Market Entry Timing Signals */}
            <MarketTimingAdvisor
              onActionClick={() => handleNavigateTab('vessel-optimizer')}
            />
          </div>
        )}

        {/* Tab 2: Problem B - Vessel Type Optimization & Port Limitations */}
        {activeTab === 'vessel-optimizer' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Route Feasibility & Draft Matcher Bar */}
            <QuickRouteAnalyzerBar
              defaultOrigin={optimizerOrigin}
              defaultDest={optimizerDest}
              defaultVolume={optimizerVolume}
              onAnalyze={handleQuickSimulate}
            />

            <VesselOptimizerTool
              key={`${optimizerOrigin}-${optimizerDest}-${optimizerVolume}`}
              initialOrigin={optimizerOrigin}
              initialDest={optimizerDest}
              initialVolume={optimizerVolume}
              currency="USD"
              onSelectCOA={() => handleNavigateTab('idle-management')}
            />
          </div>
        )}

        {/* Tab 3: Problem C - Idle Scenario Management */}
        {activeTab === 'idle-management' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <VirtualArrivalSimulator
              currency="USD"
              onNavigateToContracts={() => handleNavigateTab('risk-mitigation')}
            />
          </div>
        )}

        {/* Tab 4: Problem D - Risk Mitigation & Early Warnings */}
        {activeTab === 'risk-mitigation' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <PortCongestionMonitor
              currency="USD"
              onNavigateToVirtualArrival={() => handleNavigateTab('idle-management')}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer 
        setActiveTab={handleNavigateTab} 
      />
    </div>
  );
}

export default App;
