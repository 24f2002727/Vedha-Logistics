export type VesselType = 'Handysize' | 'Supramax' | 'Ultramax' | 'Panamax' | 'Kamsarmax' | 'Capesize';

export type BalticIndexType = 'BDI' | 'BCI' | 'BPI' | 'BSI' | 'BHSI';

export type CommodityType = 'Coking Coal' | 'Thermal Coal' | 'Iron Ore' | 'Limestone' | 'Bauxite';

export type FeasibilityStatus = 'PASSED' | 'RESTRICTED' | 'REJECTED';

export type ContractMode = 'Spot' | 'COA' | 'TimeCharter';

export type CurrencyType = 'USD' | 'INR';

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
  maxDraft: number; // in meters (chart datum)
  maxLOA: number; // in meters
  maxBeam: number; // in meters
  cargoHandlingRateTPD: number; // Tons Per Day (Discharge or Loading)
  isRiverine: boolean;
  requiresLighterageForCapesize: boolean;
  lighteringLocation?: string;
  lighteringCostPerMT?: number;
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
  gearDescription?: string;
  bestSuitedFor: string;
  dailyCharterRateSpotUSD: number;
  dailyCharterRate3MoCOAUSD: number;
  dailyCharterRate12MoCOAUSD: number;
  demurrageRateUSDPerDay: number;
  co2Factor: number; // ton CO2 per ton VLSFO (~3.114)
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
  p10?: number;
  p50?: number;
  p90?: number;
  impliedTCEUSDDay?: number;
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
  riskTolerancePercent?: number; // 0 to 100
}

export interface WaterColumnProfile {
  maxDepthScale: number; // e.g. 22.0m
  vesselDraftPercent: number;
  portDraftPercent: number;
  draftMargin: number; // port maxDraft - vessel loaded draft
  isDraftExceeded: boolean;
  draftDeficit: number;
  safeUKCMarginMeters: number;
}

export interface VesselFeasibilityResult {
  vesselType: VesselType;
  status: FeasibilityStatus;
  isFeasible: boolean;
  feasibilityScore: number; // 0 - 100
  reasons: string[];
  recommendations: string[];
  draftMargin: number;
  loaMargin: number;
  beamMargin: number;
  draftConstraintPassed: boolean;
  loaConstraintPassed: boolean;
  handlingEfficiencyScore: number;
  requiresLighterage: boolean;
  lighterageVolumeMT?: number;
  lighterageCostUSD?: number;
  lighterageCostUSDPerTon: number;
  lighterageLocation?: string;
  baseFreightPerTonUSD: number;
  effectiveFreightPerTonUSD: number;
  totalVoyageSpendUSD: number;
  totalVoyageDays: number;
  fuelCostUSD: number;
  demurrageRiskProbability: number;
  demurrageExposureUSD: number;
  co2EmissionsTons: number;
  isRecommended: boolean;
  waterColumn: WaterColumnProfile;
}

export interface VoyageAllocation {
  voyageNumber: number;
  contractType: ContractMode;
  vesselClass: VesselType;
  parcelSizeMT: number;
  laycanWindowStart: string;
  laycanWindowEnd: string;
  freightRatePerMT: number;
  totalCostUSD: number;
  lighteringCostUSD: number;
  demurrageExposureUSD: number;
  notes: string;
}

export interface ContractAllocationBreakdown {
  type: ContractMode;
  volumeMT: number;
  volumePercent: number;
  voyageCount: number;
  avgRatePerMTUSD: number;
  totalCostUSD: number;
  riskRating: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface LandedCostScenarioComparison {
  scenarioName: string;
  spotSharePercent: number;
  coaSharePercent: number;
  tcSharePercent: number;
  freightCostUSD: number;
  bunkerCostUSD: number;
  portDuesUSD: number;
  lighteringCostUSD: number;
  demurrageRiskUSD: number;
  totalCostUSD: number;
  costPerMTUSD: number;
  totalCostINR: number;
  costPerMTINR: number;
  volatilityStdDevUSD: number;
  valueAtRisk95USD: number;
}

export interface MILPOptimizerResult {
  allocations: VoyageAllocation[];
  contractBreakdown: ContractAllocationBreakdown[];
  costComparison: {
    pureSpot: LandedCostScenarioComparison;
    recommendedHybrid: LandedCostScenarioComparison;
    fixedTimeCharter: LandedCostScenarioComparison;
  };
  netSavingsUSD: number;
  netSavingsINR: number;
  savingsPercentage: number;
  riskReductionPercent: number;
  feasibilityWarnings: string[];
  executionPlanSummary: string;
}

export interface VirtualArrivalInput {
  vesselType: VesselType;
  distanceNM: number;
  originalSpeedKts: number;
  optimizedSpeedKts: number;
  knownPortDelayDays: number;
  vlsfoPriceUSD?: number;
}

export interface VirtualArrivalProfile {
  speedKts: number;
  seaDays: number;
  anchorDays: number;
  totalFuelMT: number;
  bunkerCostUSD: number;
  demurrageUSD: number;
  totalCostUSD: number;
  co2MT: number;
}

export interface VirtualArrivalResult {
  original: VirtualArrivalProfile;
  optimized: VirtualArrivalProfile;
  savings: {
    fuelSavedMT: number;
    fuelSavedUSD: number;
    demurrageSavedUSD: number;
    netFinancialBenefitUSD: number;
    co2SavedMT: number;
    ciiReductionPercent: number;
    ciiOldGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    ciiNewGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  };
  backhaulRecommendations: {
    originPort: string;
    backhaulDischargePort: string;
    commodity: string;
    distanceNM: number;
    ballastDaysSaved: number;
    projectedRevenueUSD: number;
  }[];
}

export interface MacroScenarioShock {
  id: string;
  name: string;
  description: string;
  capesizeImpactPercent: number;
  panamaxImpactPercent: number;
  supramaxImpactPercent: number;
  bunkerPriceMultiplier: number;
  congestionDaysDelta: number;
  active: boolean;
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
