export type VesselType = 'Handysize' | 'Supramax' | 'Ultramax' | 'Panamax' | 'Kamsarmax' | 'Capesize';

export type BalticIndexType = 'BDI' | 'BCI' | 'BPI' | 'BSI' | 'BHSI';

export type CommodityType = 'Coking Coal' | 'Thermal Coal' | 'Iron Ore' | 'Limestone' | 'Bauxite';

export interface PortDetails {
  id: string;
  name: string;
  code: string;
  country: string;
  region: 'East Coast India' | 'Australia' | 'United States' | 'Mozambique' | 'Russia' | 'Indonesia';
  coordinates: {
    lat: number;
    lng: number;
  };
  maxDraft: number; // in meters
  maxLOA: number; // in meters
  maxBeam: number; // in meters
  cargoHandlingRateTPD: number; // Tons Per Day (Discharge or Loading)
  isRiverine: boolean;
  requiresLighterageForCapesize: boolean;
  permittedVesselTypes: VesselType[];
  berthType: 'Mechanized Conveyor' | 'Grab Discharge' | 'Offshore Anchorage / STS' | 'Deepwater Terminal';
  avgWaitingDays: number;
  congestionStatus: 'Low' | 'Moderate' | 'High' | 'Severe';
  monsoonSensitivity: 'High' | 'Medium' | 'Low';
  description: string;
  infrastructureNotes: string;
}

export interface VesselSpecification {
  type: VesselType;
  displayName: string;
  minDwt: number;
  maxDwt: number;
  typicalDwt: number;
  typicalDraft: number; // loaded draft (m)
  typicalLOA: number; // meters
  typicalBeam: number; // meters
  ladenSpeedKnots: number;
  ballastSpeedKnots: number;
  fuelConsumptionAtSeaTonsPerDay: number;
  fuelConsumptionInPortTonsPerDay: number;
  isGeared: boolean; // has onboard cranes/grabs
  bestSuitedFor: string;
  dailyCharterRateSpotUSD: number;
  dailyCharterRate3MoCOAUSD: number;
  dailyCharterRate12MoCOAUSD: number;
}

export interface TradeRoute {
  id: string;
  originPortId: string;
  destinationPortId: string;
  originPortName: string;
  destinationPortName: string;
  originCountry: string;
  distanceNauticalMiles: number;
  chokepoints: string[];
  typicalTransitDays: number;
  spotRatePerTonUSD: number;
  projected3MoRatePerTonUSD: number;
  projected6MoRatePerTonUSD: number;
  projected12MoRatePerTonUSD: number;
  defaultCommodity: CommodityType;
  cycloneRiskSeason?: string;
  backhaulOptions: string[];
}

export interface BalticIndexForecastPoint {
  month: string;
  dateStr: string;
  historical?: number;
  forecast: number;
  confidenceLower: number;
  confidenceUpper: number;
  driverNotes: string;
}

export interface MarketTimingSignal {
  id: string;
  signalType: 'STRONG_BUY_COA' | 'ACCUMULATE_SPOT' | 'LOCK_MEDIUM_TERM' | 'WAIT_RATE_DIP';
  badgeColor: 'emerald' | 'amber' | 'blue' | 'orange';
  title: string;
  recommendedAction: string;
  optimalBookingWindow: string;
  expectedCostImpact: string;
  tradeRoutesAffected: string[];
  keyDriver: string;
  confidenceScore: number;
}

export interface VesselOptimizationInput {
  originPortId: string;
  destinationPortId: string;
  cargoVolumeMT: number;
  commodity: CommodityType;
  targetLaycanStart: string;
  targetLaycanEnd: string;
  contractHorizonMonths: 1 | 3 | 6 | 12;
  bunkerPriceSensitivityUSD: number; // VLSFO $/ton (e.g. 580)
}

export interface VesselFeasibilityResult {
  vesselType: VesselType;
  isFeasible: boolean;
  feasibilityScore: number; // 0 - 100
  reasons: string[];
  draftConstraintPassed: boolean;
  loaConstraintPassed: boolean;
  handlingEfficiencyScore: number;
  requiresLighterage: boolean;
  lighterageCostUSDPerTon: number;
  baseFreightPerTonUSD: number;
  effectiveFreightPerTonUSD: number;
  totalVoyageSpendUSD: number;
  totalVoyageDays: number;
  fuelCostUSD: number;
  demurrageRiskProbability: number;
  co2EmissionsTons: number;
  isRecommended: boolean;
}

export interface COAComparisonScenario {
  horizon: string;
  contractType: 'Single Spot Voyages' | 'Quarterly 3-Month COA' | 'Semi-Annual 6-Month COA' | 'Annual 12-Month COA';
  voyagesCount: number;
  totalVolumeMT: number;
  avgFreightRatePerTonUSD: number;
  totalFreightSpendUSD: number;
  projectedSavingsVsSpotUSD: number;
  savingsPercentage: number;
  riskExposureLevel: 'High Spot Volatility' | 'Moderate Hedged' | 'Optimal Fixed-Indexed' | 'Ultra-Secure Stable';
  recommendedEntryWindow: string;
  bunkerIndexationClause: string;
}
