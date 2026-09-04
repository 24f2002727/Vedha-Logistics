import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Layers, 
  Ship, 
  MapPin, 
  Anchor, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowRight, 
  Filter, 
  Info, 
  Play, 
  Pause,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Clock,
  Gauge
} from 'lucide-react';
import { ALL_PORTS, EAST_COAST_INDIAN_PORTS, GLOBAL_ORIGIN_PORTS } from '../../data/portsData';
import { TRADE_ROUTES } from '../../data/tradeRoutesData';
import { PortDetails, TradeRoute, VesselType } from '../../types/maritime';

export type MapFilterCategory = 'all' | 'dry_bulk' | 'iron_ore' | 'container_energy' | 'india_corridors' | 'chokepoints';

interface WorldSeaRoutesMapProps {
  onSelectRoute?: (route: TradeRoute) => void;
  onSelectPort?: (port: PortDetails) => void;
  onLaunchOptimizer?: (originId: string, destId: string, volume: number) => void;
  onLaunchCOA?: (vesselType: VesselType, volume: number) => void;
  initialSelectedRouteId?: string;
  className?: string;
  isCompactHero?: boolean;
}

// Global Sea Route Coordinates & Data
interface GlobalRoutePath {
  id: string;
  name: string;
  category: 'dry_bulk' | 'iron_ore' | 'container_energy' | 'india_corridors';
  isRedTrunk?: boolean;
  distanceNM: number;
  transitDays: number;
  origin: string;
  dest: string;
  originCoords: [number, number]; // [lat, lng]
  destCoords: [number, number];
  pathD: string;
  vesselsActive: number;
  keyCargo: string;
}

export const WorldSeaRoutesMap: React.FC<WorldSeaRoutesMapProps> = ({
  onSelectRoute,
  onSelectPort,
  onLaunchOptimizer,
  onLaunchCOA,
  initialSelectedRouteId = 'route-au-par',
  className = '',
  isCompactHero = false
}) => {
  const [activeCategory, setActiveCategory] = useState<MapFilterCategory>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialSelectedRouteId);
  const [hoveredPort, setHoveredPort] = useState<PortDetails | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<GlobalRoutePath | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(!isCompactHero);
  const [showTimeZones, setShowTimeZones] = useState<boolean>(true);
  const [showInsets, setShowInsets] = useState<boolean>(!isCompactHero);
  const [activeInset, setActiveInset] = useState<'se_asia' | 'europe' | 'india_east' | null>(null);
  const [isAISPlaying, setIsAISPlaying] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewRegion, setViewRegion] = useState<'global' | 'indo_pacific' | 'atlantic_europe' | 'india_focus'>('global');

  // Time Zones Meridian scale: UTC -12 to UTC +12
  const timeZones = [
    { label: 'UTC-12', lng: -180, x: 50, tz: '180°W' },
    { label: 'UTC-10', lng: -150, x: 175, tz: '150°W' },
    { label: 'UTC-8', lng: -120, x: 300, tz: '120°W (US West)' },
    { label: 'UTC-6', lng: -90, x: 425, tz: '90°W (US Gulf)' },
    { label: 'UTC-5', lng: -75, x: 487, tz: '75°W (US East)' },
    { label: 'UTC-3', lng: -45, x: 612, tz: '45°W (Brazil)' },
    { label: 'UTC 0', lng: 0, x: 800, tz: '0° (Greenwich/Rotterdam)' },
    { label: 'UTC+2', lng: 30, x: 925, tz: '30°E (Suez/Black Sea)' },
    { label: 'UTC+3', lng: 45, x: 987, tz: '45°E (Red Sea/Arabian Gulf)' },
    { label: 'UTC+5:30', lng: 75, x: 1112, tz: '75°E (India/Paradip)' },
    { label: 'UTC+7', lng: 105, x: 1237, tz: '105°E (Indo/Malacca)' },
    { label: 'UTC+8', lng: 120, x: 1300, tz: '120°E (Singapore/China)' },
    { label: 'UTC+9', lng: 135, x: 1362, tz: '135°E (Japan)' },
    { label: 'UTC+10', lng: 150, x: 1425, tz: '150°E (Hay Point/Aus)' },
    { label: 'UTC+12', lng: 180, x: 1550, tz: '180°E (Pacific)' },
  ];

  // Latitude circles
  const latitudeLines = [
    { label: 'Arctic Circle 66.5°N', y: 130, name: 'ARCTIC CIRCLE' },
    { label: 'Tropic of Cancer 23.5°N', y: 280, name: 'TROPIC OF CANCER' },
    { label: 'Equator 0°', y: 420, name: 'EQUATOR' },
    { label: 'Tropic of Capricorn 23.5°S', y: 560, name: 'TROPIC OF CAPRICORN' },
    { label: 'Antarctic Circle 66.5°S', y: 710, name: 'ANTARCTIC CIRCLE' }
  ];

  // Strategic Chokepoints (Matching world chart)
  const chokepoints = [
    { id: 'malacca', name: 'Strait of Malacca', x: 1230, y: 425, status: 'Active Heavy Flow', type: 'Primary Global Chokepoint' },
    { id: 'suez', name: 'Suez Canal & Red Sea', x: 945, y: 310, status: 'Advisory Risk', type: 'Asia-Europe Canal' },
    { id: 'panama', name: 'Panama Canal', x: 490, y: 395, status: 'Draft Regulated', type: 'Trans-Pacific Lock' },
    { id: 'cape', name: 'Cape of Good Hope', x: 865, y: 645, status: 'Deepwater Cape', type: 'Capesize Artery' },
    { id: 'babalmandeb', name: 'Bab el-Mandeb', x: 975, y: 365, status: 'War Risk Protocol', type: 'Red Sea Gateway' },
    { id: 'hormuz', name: 'Strait of Hormuz', x: 1015, y: 320, status: 'Energy Transit', type: 'Persian Gulf' },
    { id: 'sunda', name: 'Sunda / Lombok Strait', x: 1245, y: 475, status: 'Deep Draft Bulker Route', type: 'Indonesia Corridor' },
    { id: 'torres', name: 'Torres Strait', x: 1390, y: 485, status: 'Pilotage Compulsory', type: 'Great Barrier Reef' }
  ];

  // Global Major Sea Route Vector Geodesics
  const globalRoutes: GlobalRoutePath[] = useMemo(() => [
    // 1. Australia (Hay Point / Gladstone / Newcastle) -> India East Coast (Paradip / Vizag / Haldia / Dhamra)
    {
      id: 'route-au-par',
      name: 'Australia (Hay Point) ➔ Paradip Port (Coal Artery)',
      category: 'india_corridors',
      isRedTrunk: true,
      distanceNM: 5200,
      transitDays: 16,
      origin: 'Hay Point, Australia',
      dest: 'Paradip Port, India',
      originCoords: [-21.28, 149.3],
      destCoords: [20.26, 86.66],
      pathD: 'M 1425 570 Q 1310 470 1230 435 Q 1160 410 1115 305',
      vesselsActive: 14,
      keyCargo: 'Coking Coal (75k-180k MT)'
    },
    {
      id: 'route-au-dha',
      name: 'Australia (Gladstone) ➔ Dhamra Deepwater Port',
      category: 'india_corridors',
      distanceNM: 5240,
      transitDays: 16,
      origin: 'Gladstone, Australia',
      dest: 'Dhamra Port, India',
      originCoords: [-23.84, 151.26],
      destCoords: [20.79, 86.96],
      pathD: 'M 1430 590 Q 1320 480 1235 440 Q 1165 415 1118 300',
      vesselsActive: 9,
      keyCargo: 'Coking Coal (Capesize Direct)'
    },
    {
      id: 'route-au-hal',
      name: 'Australia (Newcastle) ➔ Haldia Dock / Sagar Lightering',
      category: 'india_corridors',
      distanceNM: 5650,
      transitDays: 18,
      origin: 'Newcastle, Australia',
      dest: 'Haldia Dock, India',
      originCoords: [-32.91, 151.78],
      destCoords: [22.02, 88.06],
      pathD: 'M 1435 635 Q 1330 500 1240 445 Q 1170 420 1125 290',
      vesselsActive: 8,
      keyCargo: 'Thermal Coal (Supramax/Lightered)'
    },
    // 2. Indonesia (Taboneo / Samarinda) -> India East Coast
    {
      id: 'route-id-par',
      name: 'Indonesia (Taboneo Anchorage) ➔ Paradip Port',
      category: 'india_corridors',
      distanceNM: 2280,
      transitDays: 7,
      origin: 'Taboneo, Indonesia',
      dest: 'Paradip Port, India',
      originCoords: [-3.61, 114.45],
      destCoords: [20.26, 86.66],
      pathD: 'M 1260 450 Q 1200 425 1115 305',
      vesselsActive: 22,
      keyCargo: 'Thermal Coal 4200 GAR'
    },
    {
      id: 'route-id-hal',
      name: 'Indonesia (Samarinda) ➔ Haldia Riverine Port',
      category: 'india_corridors',
      distanceNM: 2150,
      transitDays: 7,
      origin: 'Samarinda, Indonesia',
      dest: 'Haldia Dock, India',
      originCoords: [-0.45, 117.48],
      destCoords: [22.02, 88.06],
      pathD: 'M 1275 435 Q 1205 420 1125 290',
      vesselsActive: 16,
      keyCargo: 'Geared Supramax Coal Shuttle'
    },
    // 3. South Africa (Richards Bay) -> India East Coast
    {
      id: 'route-sa-gan',
      name: 'South Africa (Richards Bay RBCT) ➔ Gangavaram / Vizag',
      category: 'india_corridors',
      distanceNM: 4400,
      transitDays: 14,
      origin: 'Richards Bay, South Africa',
      dest: 'Gangavaram Port, India',
      originCoords: [-28.8, 32.08],
      destCoords: [17.61, 83.23],
      pathD: 'M 935 615 Q 1020 500 1105 325',
      vesselsActive: 11,
      keyCargo: 'RB1 High CV Thermal Coal'
    },
    // 4. US East Coast / Gulf -> India via Cape of Good Hope
    {
      id: 'route-us-par',
      name: 'US East Coast (Norfolk Lamberts Pt) ➔ Paradip (Cape Route)',
      category: 'dry_bulk',
      distanceNM: 9800,
      transitDays: 32,
      origin: 'Norfolk, USA',
      dest: 'Paradip Port, India',
      originCoords: [36.85, -76.29],
      destCoords: [20.26, 86.66],
      pathD: 'M 495 245 Q 630 380 865 645 Q 980 540 1115 305',
      vesselsActive: 7,
      keyCargo: 'High-Vol Met Coal'
    },
    // 5. Russia (Taman / Black Sea) -> India via Suez
    {
      id: 'route-ru-par',
      name: 'Russia (Taman Black Sea) ➔ Paradip Port via Suez',
      category: 'dry_bulk',
      distanceNM: 5400,
      transitDays: 18,
      origin: 'Taman, Russia',
      dest: 'Paradip Port, India',
      originCoords: [45.13, 36.68],
      destCoords: [20.26, 86.66],
      pathD: 'M 940 215 Q 945 310 975 365 Q 1040 375 1115 305',
      vesselsActive: 5,
      keyCargo: 'PCI Coal & Anthracite'
    },
    // 6. Trans-Pacific Strategic Red Trunk Lane (Yokohama/Shanghai -> San Francisco/Panama)
    {
      id: 'route-tp-trunk',
      name: 'Trans-Pacific Great Circle Prime Arterial (East Asia ➔ US West/Panama)',
      category: 'container_energy',
      isRedTrunk: true,
      distanceNM: 5150,
      transitDays: 12,
      origin: 'Shanghai / Yokohama',
      dest: 'Los Angeles / Panama',
      originCoords: [35.67, 139.65],
      destCoords: [33.74, -118.26],
      pathD: 'M 1375 250 Q 1550 180 1600 200 M 0 200 Q 180 220 310 260 Q 400 330 490 395',
      vesselsActive: 38,
      keyCargo: 'Manufactured Goods, Container Mega-Carriers'
    },
    // 7. Trans-Atlantic Northern Trunk Corridor (Rotterdam ➔ New York / US East)
    {
      id: 'route-ta-trunk',
      name: 'North Atlantic Trunk Highway (Rotterdam/London ➔ New York/Norfolk)',
      category: 'container_energy',
      isRedTrunk: true,
      distanceNM: 3400,
      transitDays: 9,
      origin: 'Rotterdam, Netherlands',
      dest: 'New York, USA',
      originCoords: [51.92, 4.47],
      destCoords: [40.71, -74.00],
      pathD: 'M 810 185 Q 650 170 495 235',
      vesselsActive: 29,
      keyCargo: 'Refined Products, Machinery, Containers'
    },
    // 8. Asia - Middle East - Europe Superhighway (Shanghai -> Singapore -> Suez -> Rotterdam)
    {
      id: 'route-asia-eu-super',
      name: 'Asia-Europe Mega Artery (Shanghai ➔ Singapore ➔ Suez ➔ Rotterdam)',
      category: 'container_energy',
      isRedTrunk: true,
      distanceNM: 10500,
      transitDays: 24,
      origin: 'Shanghai, China',
      dest: 'Rotterdam, Netherlands',
      originCoords: [31.23, 121.47],
      destCoords: [51.92, 4.47],
      pathD: 'M 1320 265 Q 1280 360 1240 425 Q 1150 435 975 365 Q 945 310 885 270 Q 840 225 810 185',
      vesselsActive: 45,
      keyCargo: 'Global Container Liners & Chemical Products'
    },
    // 9. Brazil (Tubarão / Santos) -> China & India (Iron Ore Cape Route)
    {
      id: 'route-br-china',
      name: 'Brazil (Tubarão / Ponta da Madeira) ➔ China / India (Valemax Ore)',
      category: 'iron_ore',
      distanceNM: 11200,
      transitDays: 34,
      origin: 'Tubarão, Brazil',
      dest: 'Qingdao, China',
      originCoords: [-20.28, -40.24],
      destCoords: [36.06, 120.38],
      pathD: 'M 635 530 Q 750 630 865 645 Q 1060 620 1240 425 Q 1310 330 1335 240',
      vesselsActive: 24,
      keyCargo: 'Iron Ore Fines (400k DWT Valemax)'
    },
    // 10. Australia (Port Hedland / Dampier) -> China (Iron Ore Direct)
    {
      id: 'route-au-hed-china',
      name: 'Australia (Port Hedland / Dampier) ➔ Qingdao / Ningbo (Iron Ore Shuttle)',
      category: 'iron_ore',
      distanceNM: 3600,
      transitDays: 10,
      origin: 'Port Hedland, Australia',
      dest: 'Qingdao, China',
      originCoords: [-20.31, 118.57],
      destCoords: [36.06, 120.38],
      pathD: 'M 1360 560 Q 1340 440 1335 240',
      vesselsActive: 31,
      keyCargo: 'Iron Ore (Capesize / VLOC)'
    },
    // 11. Middle East (Ras Tanura / Fujairah) -> India West & East Coast
    {
      id: 'route-me-in',
      name: 'Middle East (Fujairah / Ras Tanura) ➔ India Energy Corridors',
      category: 'container_energy',
      distanceNM: 1450,
      transitDays: 4,
      origin: 'Fujairah, UAE',
      dest: 'Jamnagar / Paradip',
      originCoords: [25.12, 56.32],
      destCoords: [20.26, 86.66],
      pathD: 'M 1015 320 Q 1060 350 1115 305',
      vesselsActive: 19,
      keyCargo: 'Crude Oil & Clean Petroleum Products'
    }
  ], []);

  // Filter routes based on active category
  const filteredRoutes = useMemo(() => {
    if (activeCategory === 'all') return globalRoutes;
    if (activeCategory === 'chokepoints') return globalRoutes.filter(r => r.isRedTrunk || r.category === 'india_corridors');
    return globalRoutes.filter(r => r.category === activeCategory);
  }, [activeCategory, globalRoutes]);

  const activeRouteObj = useMemo(() => {
    return globalRoutes.find(r => r.id === selectedRouteId) || globalRoutes[0];
  }, [selectedRouteId, globalRoutes]);

  // Major World Ports for Interactive Markers
  const worldMajorPorts = [
    // India East Coast
    { id: 'in-par', name: 'Paradip', country: 'India', x: 1115, y: 305, draft: '16.0m', type: 'Mechanized Deep Coal', code: 'INPRT', region: 'India' },
    { id: 'in-viz', name: 'Visakhapatnam (Vizag)', country: 'India', x: 1105, y: 325, draft: '18.1m', type: 'Outer Harbour Capesize', code: 'INVTZ', region: 'India' },
    { id: 'in-hal', name: 'Haldia / Sagar', country: 'India', x: 1125, y: 290, draft: '8.5m', type: 'Riverine + STS Lighterage', code: 'INHAL', region: 'India' },
    { id: 'in-dha', name: 'Dhamra', country: 'India', x: 1118, y: 300, draft: '18.0m', type: 'Deepwater Capesize Terminal', code: 'INDHR', region: 'India' },
    { id: 'in-gan', name: 'Gangavaram', country: 'India', x: 1104, y: 326, draft: '18.5m', type: 'Deepest East Coast Port', code: 'INGGV', region: 'India' },
    
    // East Asia & SE Asia
    { id: 'sg-sin', name: 'Singapore Hub', country: 'Singapore', x: 1240, y: 425, draft: '18.5m', type: 'Bunkering & Transshipment #1', code: 'SGSIN', region: 'SE Asia' },
    { id: 'id-tab', name: 'Taboneo (Kalimantan)', country: 'Indonesia', x: 1260, y: 450, draft: '14.5m', type: 'Offshore Coal Anchorage', code: 'IDTAB', region: 'Indonesia' },
    { id: 'cn-sha', name: 'Shanghai / Ningbo', country: 'China', x: 1320, y: 265, draft: '17.5m', type: 'World Largest Cargo Port', code: 'CNSHA', region: 'China' },
    { id: 'cn-qin', name: 'Qingdao', country: 'China', x: 1335, y: 240, draft: '20.0m', type: 'Capesize Mineral Terminal', code: 'CNTAO', region: 'China' },
    { id: 'jp-tok', name: 'Tokyo / Yokohama', country: 'Japan', x: 1375, y: 250, draft: '16.0m', type: 'Pacific Industrial Gateway', code: 'JPTYO', region: 'Japan' },
    
    // Australia
    { id: 'au-hay', name: 'Hay Point (DBCT)', country: 'Australia', x: 1425, y: 570, draft: '19.0m', type: 'World Coking Coal Hub', code: 'AUHPT', region: 'Australia' },
    { id: 'au-new', name: 'Newcastle (PWCS)', country: 'Australia', x: 1435, y: 635, draft: '15.2m', type: 'Thermal Coal Export Terminal', code: 'AUNTL', region: 'Australia' },
    { id: 'au-hed', name: 'Port Hedland / Dampier', country: 'Australia', x: 1360, y: 560, draft: '19.5m', type: 'Pilbara Iron Ore Megaport', code: 'AUPHE', region: 'Australia' },
    
    // Europe & Middle East
    { id: 'nl-rot', name: 'Rotterdam Gateway', country: 'Netherlands', x: 810, y: 185, draft: '24.0m', type: 'European Main Port', code: 'NLRTM', region: 'Europe' },
    { id: 'de-ham', name: 'Hamburg', country: 'Germany', x: 825, y: 175, draft: '15.1m', type: 'North Sea Hub', code: 'DEHAM', region: 'Europe' },
    { id: 'ae-fuj', name: 'Fujairah / Hormuz', country: 'UAE', x: 1015, y: 320, draft: '18.0m', type: 'Middle East Bunkering & Crude', code: 'AEFJR', region: 'Middle East' },
    { id: 'ru-tam', name: 'Taman (Black Sea)', country: 'Russia', x: 940, y: 215, draft: '18.2m', type: 'Russian Coal Export Terminal', code: 'RUTAM', region: 'Russia' },
    
    // Americas & Africa
    { id: 'us-nor', name: 'Norfolk (Lamberts Pt)', country: 'United States', x: 495, y: 245, draft: '15.2m', type: 'US Met Coal Pier 6', code: 'USORF', region: 'United States' },
    { id: 'us-hou', name: 'Houston / US Gulf', country: 'United States', x: 430, y: 280, draft: '14.5m', type: 'Energy & Bulk Gateway', code: 'USHOU', region: 'United States' },
    { id: 'us-lax', name: 'Los Angeles / Long Beach', country: 'United States', x: 310, y: 260, draft: '16.5m', type: 'Pacific Rim Superport', code: 'USLAX', region: 'United States' },
    { id: 'br-tub', name: 'Tubarão (Vale Ore)', country: 'Brazil', x: 635, y: 530, draft: '23.0m', type: 'World Largest Iron Ore Terminal', code: 'BRTUB', region: 'Brazil' },
    { id: 'za-rcb', name: 'Richards Bay (RBCT)', country: 'South Africa', x: 935, y: 615, draft: '17.5m', type: 'Largest African Coal Terminal', code: 'ZARCB', region: 'South Africa' }
  ];

  const handleRouteClick = (route: GlobalRoutePath) => {
    setSelectedRouteId(route.id);
    setIsInspectorOpen(true);
    const matched = TRADE_ROUTES.find(r => r.id === route.id);
    if (matched && onSelectRoute) {
      onSelectRoute(matched);
    }
  };

  const handlePortClick = (p: typeof worldMajorPorts[0]) => {
    const matchedPort = ALL_PORTS.find(port => port.id === p.id || port.code === p.code);
    if (matchedPort && onSelectPort) {
      onSelectPort(matchedPort);
    }
  };

  return (
    <div className={`relative bg-[#071324] text-slate-100 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden font-sans select-none ${className}`}>
      
      {/* Top Professional Nautical Header & Category Filter Bar */}
      <div className="relative z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-display font-extrabold tracking-tight text-white flex items-center gap-2">
                World Map of Major Sea Routes & Shipping Lanes
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                Hydrographic Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Geodesic trade lanes, UTC time-zone meridians, chokepoint risks, and East Coast India bulk corridors.
            </p>
          </div>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'All Global Sea Routes', icon: Compass },
            { id: 'india_corridors', label: 'India East Coast Inbound', icon: Anchor },
            { id: 'dry_bulk', label: 'Dry Bulk & Coal Lanes', icon: Ship },
            { id: 'iron_ore', label: 'Iron Ore Megacarriers', icon: Layers },
            { id: 'container_energy', label: 'Container & Energy Arteries', icon: Gauge },
            { id: 'chokepoints', label: 'Strategic Chokepoints', icon: AlertTriangle },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as MapFilterCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Controls & Toggles */}
        <div className="flex items-center gap-2">
          {/* AIS Play/Pause */}
          <button
            onClick={() => setIsAISPlaying(!isAISPlaying)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isAISPlaying 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isAISPlaying ? 'Pause Live AIS Pulse' : 'Resume Live AIS Pulse'}
          >
            {isAISPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AIS {isAISPlaying ? 'Live' : 'Paused'}</span>
          </button>

          {/* Time Zone Grid Toggle */}
          <button
            onClick={() => setShowTimeZones(!showTimeZones)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              showTimeZones
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle UTC Meridian Bands"
          >
            UTC Grid
          </button>

          {/* Insets Toggle */}
          <button
            onClick={() => setShowInsets(!showInsets)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              showInsets
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Regional Inset Windows"
          >
            Insets
          </button>

          {/* Reset Zoom */}
          <button
            onClick={() => { setZoomLevel(1); setViewRegion('global'); }}
            className="p-1.5 rounded-lg text-slate-400 bg-slate-800 hover:text-white border border-slate-700 cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Map SVG Viewport */}
      <div className="relative w-full aspect-[16/8.6] min-h-[500px] sm:min-h-[620px] bg-[#0A192F] overflow-hidden">
        
        {/* Subtle Ocean Bathymetric Contours & Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#112D4E]/60 via-[#0A192F] to-[#040D1A]"></div>

        <svg
          viewBox="0 0 1600 850"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="routeCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="routeRedTrunk" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#F97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="routeActiveHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="1" />
              <stop offset="50%" stopColor="#FB923C" stopOpacity="1" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="1" />
            </linearGradient>

            {/* Glowing filter for main lines */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Pattern for Ocean Time-Zone Grid */}
            <pattern id="nauticalSubgrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background Grid Canvas */}
          <rect width="1600" height="850" fill="url(#nauticalSubgrid)" />

          {/* ================= 1. TIME ZONE MERIDIAN BANDS (UTC -12 to +12) ================= */}
          {showTimeZones && (
            <g className="time-zones-layer" opacity="0.7">
              {timeZones.map((tz, i) => (
                <g key={`tz-${i}`}>
                  {/* Vertical Meridian Line */}
                  <line
                    x1={tz.x}
                    y1={30}
                    x2={tz.x}
                    y2={820}
                    stroke="#1E3A8A"
                    strokeWidth="0.8"
                    strokeDasharray="4 6"
                    opacity="0.45"
                  />
                  {/* Top Scale Label */}
                  <rect x={tz.x - 24} y={6} width={48} height={18} rx={3} fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                  <text
                    x={tz.x}
                    y={19}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {tz.label}
                  </text>

                  {/* Bottom Scale Label */}
                  <rect x={tz.x - 24} y={824} width={48} height={18} rx={3} fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                  <text
                    x={tz.x}
                    y={837}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {tz.tz.split(' ')[0]}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* ================= 2. LATITUDE REFERENCE LINES ================= */}
          <g className="latitudes-layer" opacity="0.6">
            {latitudeLines.map((lat, i) => (
              <g key={`lat-${i}`}>
                <line
                  x1={30}
                  y1={lat.y}
                  x2={1570}
                  y2={lat.y}
                  stroke="#1E3A8A"
                  strokeWidth="0.8"
                  strokeDasharray={lat.y === 420 ? 'none' : '3 5'}
                  opacity={lat.y === 420 ? 0.7 : 0.4}
                />
                <text
                  x={40}
                  y={lat.y - 4}
                  fill="#475569"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  {lat.name} ({lat.label.split(' ')[2] || ''})
                </text>
              </g>
            ))}
          </g>

          {/* ================= 3. OCEAN LABELS (Authentic Nautical Typography) ================= */}
          <g className="ocean-labels" opacity="0.35" fill="#38BDF8" fontFamily="sans-serif" fontWeight="900" letterSpacing="4">
            <text x="220" y="440" fontSize="15" textAnchor="middle">PACIFIC OCEAN</text>
            <text x="1490" y="440" fontSize="15" textAnchor="middle">PACIFIC OCEAN</text>
            <text x="660" y="320" fontSize="14" textAnchor="middle">NORTH ATLANTIC OCEAN</text>
            <text x="710" y="580" fontSize="14" textAnchor="middle">SOUTH ATLANTIC OCEAN</text>
            <text x="1050" y="530" fontSize="16" textAnchor="middle">INDIAN OCEAN</text>
            <text x="800" y="70" fontSize="12" textAnchor="middle">ARCTIC OCEAN</text>
            <text x="800" y="780" fontSize="12" textAnchor="middle">SOUTHERN OCEAN</text>
            
            {/* Regional Sea Names */}
            <text x="1150" y="340" fontSize="9" fill="#67E8F9" letterSpacing="2">BAY OF BENGAL</text>
            <text x="1040" y="360" fontSize="9" fill="#67E8F9" letterSpacing="2">ARABIAN SEA</text>
            <text x="1270" y="360" fontSize="9" fill="#67E8F9" letterSpacing="2">SOUTH CHINA SEA</text>
            <text x="1460" y="520" fontSize="9" fill="#67E8F9" letterSpacing="2">CORAL SEA</text>
            <text x="860" y="270" fontSize="9" fill="#67E8F9" letterSpacing="2">MEDITERRANEAN</text>
          </g>

          {/* ================= 4. WORLD CONTINENTS & LANDMASS SILHOUETTES ================= */}
          <g className="world-continents" fill="#1E293B" stroke="#334155" strokeWidth="1" opacity="0.85">
            {/* North America */}
            <path d="M 190 120 Q 250 90 340 130 Q 380 170 360 250 Q 340 280 300 290 Q 240 310 220 270 Q 180 200 190 120 Z" />
            <path d="M 330 180 Q 420 160 480 200 Q 510 250 490 310 Q 430 330 350 280 Q 320 230 330 180 Z" />
            <path d="M 430 300 Q 460 340 480 390 Q 450 400 420 360 Q 400 320 430 300 Z" /> {/* Central America */}
            
            {/* Greenland */}
            <path d="M 570 60 Q 640 50 670 90 Q 650 140 590 150 Q 560 110 570 60 Z" />
            
            {/* South America */}
            <path d="M 490 400 Q 590 420 640 470 Q 660 550 620 640 Q 570 730 540 730 Q 520 640 500 530 Q 470 440 490 400 Z" />
            
            {/* Europe */}
            <path d="M 760 140 Q 840 120 890 160 Q 900 220 840 250 Q 780 260 740 220 Q 730 170 760 140 Z" />
            {/* British Isles */}
            <path d="M 745 150 Q 770 140 775 170 Q 755 190 740 175 Z" />
            <path d="M 725 155 Q 740 150 740 170 Q 725 175 725 155 Z" />
            
            {/* Africa */}
            <path d="M 760 270 Q 880 260 920 330 Q 960 430 940 550 Q 910 650 860 660 Q 800 660 780 570 Q 730 460 730 360 Q 730 290 760 270 Z" />
            {/* Madagascar */}
            <path d="M 975 540 Q 995 530 1000 580 Q 980 620 970 590 Z" />

            {/* Eurasia / Russia / Northern Asia */}
            <path d="M 890 120 Q 1100 80 1320 110 Q 1460 160 1440 250 Q 1340 310 1240 330 Q 1120 310 990 260 Q 910 200 890 120 Z" />

            {/* China & East Asia */}
            <path d="M 1200 240 Q 1340 230 1370 300 Q 1320 380 1220 390 Q 1160 360 1180 300 Z" />
            
            {/* Japan Archipelago */}
            <path d="M 1390 220 Q 1420 220 1410 270 Q 1380 290 1370 250 Z" />

            {/* Indian Subcontinent (Prominent East Coast Focus) */}
            <path d="M 1040 270 Q 1120 275 1135 320 Q 1120 400 1090 430 Q 1060 400 1035 330 Q 1020 290 1040 270 Z" fill="#24334D" stroke="#38BDF8" strokeWidth="1.2" />

            {/* Southeast Asia Archipelago & Indonesia (Kalimantan, Sumatra, Java, Philippines) */}
            <path d="M 1190 380 Q 1240 390 1250 440 Q 1200 460 1180 410 Z" />
            <path d="M 1240 430 Q 1300 430 1300 480 Q 1240 490 1230 450 Z" />
            <path d="M 1270 340 Q 1310 340 1320 400 Q 1280 410 1270 360 Z" />

            {/* Australia */}
            <path d="M 1320 520 Q 1460 490 1480 580 Q 1470 670 1360 680 Q 1280 620 1320 520 Z" />
            {/* New Zealand */}
            <path d="M 1520 660 Q 1550 650 1545 700 Q 1515 710 1515 670 Z" />
          </g>

          {/* ================= 5. GLOBAL SEA ROUTES NETWORK (Geodesic Curves) ================= */}
          <g className="global-sea-routes">
            
            {/* Secondary Ambient Sea Routes Network (Creates high-density nautical mesh) */}
            <g stroke="#0284C7" strokeWidth="0.8" opacity="0.22" fill="none">
              {/* Trans-Pacific ambient mesh */}
              <path d="M 1375 250 Q 1550 200 1600 240 M 0 240 Q 150 280 310 260" />
              <path d="M 1320 265 Q 1520 220 1600 260 M 0 260 Q 160 300 310 280" />
              <path d="M 1425 570 Q 1550 520 1600 500 M 0 500 Q 180 480 490 395" />
              
              {/* Atlantic ambient mesh */}
              <path d="M 495 245 Q 640 220 810 185" />
              <path d="M 430 280 Q 600 260 760 270" />
              <path d="M 635 530 Q 720 420 810 185" />
              <path d="M 635 530 Q 750 560 860 660" />
              <path d="M 495 245 Q 680 440 860 660" />

              {/* Indian Ocean ambient mesh */}
              <path d="M 860 660 Q 980 580 1240 425" />
              <path d="M 975 365 Q 1100 450 1360 560" />
              <path d="M 1115 305 Q 1200 380 1425 570" />
              <path d="M 1015 320 Q 1150 420 1260 450" />
              <path d="M 1105 325 Q 1220 440 1435 635" />
            </g>

            {/* Primary Filtered & Highlighted Sea Route Trunks */}
            {filteredRoutes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const isHovered = hoveredRoute?.id === route.id;
              
              let strokeColor = 'url(#routeCyanGlow)';
              let strokeWidth = route.isRedTrunk ? 2.5 : 1.8;
              let opacity = 0.75;
              let filter = 'url(#subtleGlow)';

              if (route.isRedTrunk) {
                strokeColor = 'url(#routeRedTrunk)';
                opacity = 0.85;
              }

              if (isHovered || isSelected) {
                strokeColor = 'url(#routeActiveHighlight)';
                strokeWidth = 3.6;
                opacity = 1;
                filter = 'url(#glow)';
              }

              return (
                <g 
                  key={route.id}
                  className="route-group cursor-pointer transition-all duration-300"
                  onClick={() => handleRouteClick(route)}
                  onMouseEnter={() => setHoveredRoute(route)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  {/* Outer invisible hit target for easy clicking */}
                  <path
                    d={route.pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                  />

                  {/* Visible Curved Geodesic Path */}
                  <path
                    d={route.pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    filter={filter}
                    strokeLinecap="round"
                    strokeDasharray={isSelected ? '8 4' : 'none'}
                    className={isSelected ? 'animate-pulse' : ''}
                  />

                  {/* Animated Vessel Beacon Particle traveling along path */}
                  {isAISPlaying && (
                    <circle r={isSelected ? '4.5' : '3'} fill={route.isRedTrunk ? '#EF4444' : '#38BDF8'} filter="url(#glow)">
                      <animateMotion
                        path={route.pathD}
                        dur={`${Math.max(8, Math.round(route.transitDays * 0.75))}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* ================= 6. STRATEGIC CHOKEPOINTS BADGES ================= */}
          {(activeCategory === 'all' || activeCategory === 'chokepoints') && (
            <g className="chokepoints-layer">
              {chokepoints.map((cp) => (
                <g key={cp.id} className="cursor-pointer group" transform={`translate(${cp.x}, ${cp.y})`}>
                  <circle r="7" fill="#EF4444" opacity="0.25" className="animate-ping" />
                  <circle r="4" fill="#EF4444" stroke="#FFF" strokeWidth="1" />
                  <text
                    x="8"
                    y="3"
                    fill="#FCA5A5"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="opacity-85 group-hover:opacity-100"
                  >
                    {cp.name}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* ================= 7. GLOBAL PORTS & HUBS ================= */}
          <g className="world-ports-layer">
            {worldMajorPorts.map((port) => {
              const isIndianEast = port.region === 'India';
              const isSelected = activeRouteObj.dest.includes(port.name) || activeRouteObj.origin.includes(port.name);

              return (
                <g
                  key={port.id}
                  transform={`translate(${port.x}, ${port.y})`}
                  className="port-marker cursor-pointer group"
                  onClick={() => handlePortClick(port)}
                  onMouseEnter={() => {
                    const fullPort = ALL_PORTS.find(p => p.id === port.id || p.code === port.code);
                    if (fullPort) setHoveredPort(fullPort);
                  }}
                  onMouseLeave={() => setHoveredPort(null)}
                >
                  {/* Pulsing ring for Indian East Coast focus or selected port */}
                  {(isIndianEast || isSelected) && (
                    <circle
                      r="9"
                      fill={isIndianEast ? '#0284C7' : '#F59E0B'}
                      opacity="0.35"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Pin Dot */}
                  <circle
                    r={isIndianEast ? '4.5' : '3.5'}
                    fill={isIndianEast ? '#38BDF8' : '#CBD5E1'}
                    stroke={isIndianEast ? '#0284C7' : '#0F172A'}
                    strokeWidth="1.5"
                    className="group-hover:scale-150 transition-transform"
                  />

                  {/* Label */}
                  <text
                    x="6"
                    y="3"
                    fill={isIndianEast ? '#7DD3FC' : '#94A3B8'}
                    fontSize={isIndianEast ? '9' : '7.5'}
                    fontFamily="sans-serif"
                    fontWeight={isIndianEast ? 'bold' : 'normal'}
                    className="group-hover:fill-white group-hover:font-bold"
                  >
                    {port.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ================= 8. INSET MAP DETAIL WINDOWS (Matching Reference Image) ================= */}
          {showInsets && (
            <g className="regional-insets-layer">
              
              {/* Inset 1: Southeast Asia, Indonesia & Malacca Strait (Bottom Center-Left) */}
              <g 
                transform="translate(420, 610)"
                className="cursor-pointer group"
                onClick={() => setActiveInset(activeInset === 'se_asia' ? null : 'se_asia')}
              >
                {/* Window Box */}
                <rect width="260" height="150" rx="6" fill="#0A1628" stroke="#0284C7" strokeWidth="1.5" opacity="0.95" filter="url(#glow)" />
                <rect width="260" height="22" rx="4" fill="#0F2442" />
                <text x="10" y="15" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  INSET 1: SE ASIA & MALACCA STRAIT CORRIDOR
                </text>
                <text x="240" y="15" fill="#64748B" fontSize="9" textAnchor="end">🔍 Zoom</text>

                {/* Local Mini Coastlines */}
                <path d="M 30 40 Q 80 50 110 90 Q 90 120 50 100 Z" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
                <path d="M 120 70 Q 180 60 210 100 Q 170 130 130 110 Z" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
                
                {/* Dense Local Feeder Lines */}
                <path d="M 60 70 Q 110 85 145 95" stroke="#38BDF8" strokeWidth="1.2" fill="none" />
                <path d="M 80 50 Q 110 85 170 90" stroke="#0284C7" strokeWidth="1" fill="none" />
                <path d="M 90 90 Q 140 100 200 95" stroke="#38BDF8" strokeWidth="1" fill="none" />
                <path d="M 145 95 Q 210 120 240 130" stroke="#0284C7" strokeWidth="1" fill="none" />

                {/* Local Pin Badges */}
                <circle cx="110" cy="85" r="3" fill="#38BDF8" />
                <text x="115" y="85" fill="#BAE6FD" fontSize="7" fontWeight="bold">Singapore (SGSIN)</text>
                <circle cx="170" cy="95" r="2.5" fill="#F59E0B" />
                <text x="175" y="98" fill="#FDE68A" fontSize="6.5">Taboneo (Coal)</text>
                <circle cx="190" cy="80" r="2.5" fill="#F59E0B" />
                <text x="195" y="82" fill="#FDE68A" fontSize="6.5">Samarinda</text>
              </g>

              {/* Inset 2: European Gateway, English Channel & Rotterdam (Bottom Right) */}
              <g 
                transform="translate(1260, 610)"
                className="cursor-pointer group"
                onClick={() => setActiveInset(activeInset === 'europe' ? null : 'europe')}
              >
                {/* Window Box */}
                <rect width="280" height="150" rx="6" fill="#0A1628" stroke="#0284C7" strokeWidth="1.5" opacity="0.95" filter="url(#glow)" />
                <rect width="280" height="22" rx="4" fill="#0F2442" />
                <text x="10" y="15" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  INSET 2: EUROPE & ENGLISH CHANNEL GATEWAY
                </text>
                <text x="260" y="15" fill="#64748B" fontSize="9" textAnchor="end">🔍 Zoom</text>

                {/* Local Mini Coastlines */}
                <path d="M 40 40 Q 90 30 110 70 Q 70 90 30 70 Z" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
                <path d="M 120 50 Q 220 40 250 110 Q 180 130 130 90 Z" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
                
                {/* Dense Local Sea Lanes */}
                <path d="M 30 110 Q 95 75 160 65" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
                <path d="M 160 65 Q 210 55 260 50" stroke="#0284C7" strokeWidth="1.2" fill="none" />
                <path d="M 160 65 Q 180 90 200 130" stroke="#0284C7" strokeWidth="1" fill="none" />

                {/* Local Pin Badges */}
                <circle cx="160" cy="65" r="3.5" fill="#38BDF8" />
                <text x="166" y="66" fill="#BAE6FD" fontSize="7.5" fontWeight="bold">Rotterdam (NLRTM)</text>
                <circle cx="150" cy="78" r="2.5" fill="#94A3B8" />
                <text x="156" y="80" fill="#CBD5E1" fontSize="6.5">Antwerp</text>
                <circle cx="210" cy="55" r="2.5" fill="#94A3B8" />
                <text x="216" y="57" fill="#CBD5E1" fontSize="6.5">Hamburg</text>
              </g>

            </g>
          )}

        </svg>

        {/* Hover Port Card Tooltip */}
        {hoveredPort && (
          <div className="absolute top-4 left-4 z-30 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/40 shadow-xl max-w-xs text-xs space-y-1.5 pointer-events-none animate-fadeIn">
            <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
              <span className="font-bold text-cyan-400 font-mono text-[11px] uppercase">
                {hoveredPort.name} ({hoveredPort.code})
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                Draft: {hoveredPort.maxDraft}m
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              <p><span className="text-slate-500">Berth Type:</span> {hoveredPort.berthType}</p>
              <p><span className="text-slate-500">Discharge/Load:</span> {hoveredPort.cargoHandlingRateTPD.toLocaleString()} TPD</p>
              <p><span className="text-slate-500">Avg. Queue:</span> {hoveredPort.avgWaitingDays} Days ({hoveredPort.congestionStatus} Congestion)</p>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Interactive Route Inspector & Fast Action Bar */}
      {isInspectorOpen && activeRouteObj && (
        <div className="relative z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Selected Route Info */}
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Inspecting Corridor
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {activeRouteObj.keyCargo}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-display font-extrabold text-white">
                {activeRouteObj.name}
              </h4>
              <p className="text-xs text-slate-400">
                Primary arterial trade corridor connecting international loading facilities with Indian industrial consumers.
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Nautical Distance</span>
                <span className="text-sm sm:text-base font-extrabold text-cyan-300 font-mono">
                  {activeRouteObj.distanceNM.toLocaleString()} NM
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Transit Time</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  ~{activeRouteObj.transitDays} Days
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Active Vessels</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                  {activeRouteObj.vesselsActive} Bulkers
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Optimal Bulker</span>
                <span className="text-sm sm:text-base font-extrabold text-orange-400 font-mono">
                  Panamax / Cape
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto">
              {onLaunchOptimizer && (
                <button
                  onClick={() => onLaunchOptimizer(activeRouteObj.id.includes('au') ? 'au-hay' : 'id-tab', 'in-par', 75000)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer font-sans"
                >
                  <Ship className="w-4 h-4" />
                  <span>Solve Vessel Draft</span>
                </button>
              )}

              {onLaunchCOA && (
                <button
                  onClick={() => onLaunchCOA('Panamax', 600000)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all cursor-pointer font-sans"
                >
                  <Layers className="w-4 h-4" />
                  <span>Model COA Savings</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
