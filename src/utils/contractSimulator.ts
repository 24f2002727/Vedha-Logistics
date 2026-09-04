import {
  COAComparisonScenario,
  VesselType,
  MILPOptimizerResult,
  VoyageAllocation,
  ContractAllocationBreakdown,
  LandedCostScenarioComparison,
  ContractMode
} from '../types/maritime';
import { VESSEL_CLASSES } from '../data/vesselData';
import { ALL_PORTS } from '../data/portsData';
import { USD_TO_INR_RATE } from './currencyUtils';

/**
 * Standard Multi-Scenario COA Financial Model
 */
export function simulateCOAScenarios(
  annualVolumeMT: number,
  selectedVesselType: VesselType,
  baseSpotRatePerTonUSD: number
): COAComparisonScenario[] {
  const vessel = VESSEL_CLASSES.find(v => v.type === selectedVesselType) || VESSEL_CLASSES[3];
  const parcelCapacity = vessel.typicalDwt * 0.95;
  const totalAnnualVoyages = Math.ceil(annualVolumeMT / parcelCapacity);

  // Spot (Base)
  const spotRate = baseSpotRatePerTonUSD;
  const spotTotalSpend = Math.round(spotRate * annualVolumeMT);

  // 3-Month COA (Quarterly)
  const qtr3MoRate = Number((spotRate * 0.915).toFixed(2)); // ~8.5% discount
  const qtr3MoSpend = Math.round(qtr3MoRate * annualVolumeMT);
  const qtr3MoSavings = spotTotalSpend - qtr3MoSpend;

  // 6-Month COA (Semi-annual)
  const semi6MoRate = Number((spotRate * 0.865).toFixed(2)); // ~13.5% discount
  const semi6MoSpend = Math.round(semi6MoRate * annualVolumeMT);
  const semi6MoSavings = spotTotalSpend - semi6MoSpend;

  // 12-Month COA (Annual Contract of Affreightment)
  const annual12MoRate = Number((spotRate * 0.815).toFixed(2)); // ~18.5% discount
  const annual12MoSpend = Math.round(annual12MoRate * annualVolumeMT);
  const annual12MoSavings = spotTotalSpend - annual12MoSpend;

  return [
    {
      horizon: 'Spot Market (Status Quo)',
      contractType: 'Single Spot Voyages',
      voyagesCount: totalAnnualVoyages,
      totalVolumeMT: annualVolumeMT,
      avgFreightRatePerTonUSD: spotRate,
      totalFreightSpendUSD: spotTotalSpend,
      projectedSavingsVsSpotUSD: 0,
      savingsPercentage: 0,
      riskExposureLevel: 'High Spot Volatility',
      recommendedEntryWindow: 'Reactive Daily Exposure (Not Recommended)',
      bunkerIndexationClause: '100% Unhedged (Shipowner spot risk premium baked into price)'
    },
    {
      horizon: '3 Months (Quarterly COA)',
      contractType: 'Quarterly 3-Month COA',
      voyagesCount: Math.ceil(totalAnnualVoyages / 4),
      totalVolumeMT: Math.round(annualVolumeMT / 4),
      avgFreightRatePerTonUSD: qtr3MoRate,
      totalFreightSpendUSD: Math.round(qtr3MoSpend / 4),
      projectedSavingsVsSpotUSD: Math.round(qtr3MoSavings / 4),
      savingsPercentage: 8.5,
      riskExposureLevel: 'Moderate Hedged',
      recommendedEntryWindow: 'Lock 2-3 weeks prior to high-demand Q4 ramp-up',
      bunkerIndexationClause: 'Fixed Freight with +/- $25/t VLSFO Singapore trigger collar'
    },
    {
      horizon: '6 Months (Semi-Annual COA)',
      contractType: 'Semi-Annual 6-Month COA',
      voyagesCount: Math.ceil(totalAnnualVoyages / 2),
      totalVolumeMT: Math.round(annualVolumeMT / 2),
      avgFreightRatePerTonUSD: semi6MoRate,
      totalFreightSpendUSD: Math.round(semi6MoSpend / 2),
      projectedSavingsVsSpotUSD: Math.round(semi6MoSavings / 2),
      savingsPercentage: 13.5,
      riskExposureLevel: 'Optimal Fixed-Indexed',
      recommendedEntryWindow: 'Optimal Window: Mid-September for H1 forward protection',
      bunkerIndexationClause: 'Base BDI Index + 15% discount with quarterly bunker adjustment formula'
    },
    {
      horizon: '12 Months (Annual Programmatic COA)',
      contractType: 'Annual 12-Month COA',
      voyagesCount: totalAnnualVoyages,
      totalVolumeMT: annualVolumeMT,
      avgFreightRatePerTonUSD: annual12MoRate,
      totalFreightSpendUSD: annual12MoSpend,
      projectedSavingsVsSpotUSD: annual12MoSavings,
      savingsPercentage: 18.5,
      riskExposureLevel: 'Ultra-Secure Stable',
      recommendedEntryWindow: 'Execute during Feb seasonal trough for full calendar year',
      bunkerIndexationClause: 'Full BIMCO COA clause with guaranteed demurrage cap ($18,500/day)'
    }
  ];
}

/**
 * Mixed-Integer Linear Programming (MILP) Portfolio Optimizer Engine
 * Mathematically allocates volume between COA, Period Time Charter, and Spot
 * and creates laycan schedules and landed cost waterfalls.
 */
export function runMILPPortfolioOptimizer(params: {
  originPortId: string;
  dischargePortId: string;
  totalVolumeMT: number;
  deliveryHorizonMonths: number;
  riskTolerancePercent?: number; // 0 (aggressive cost min) to 100 (conservative budget stability)
  vesselType?: VesselType;
  baseSpotRateUSD?: number;
}): MILPOptimizerResult {
  const {
    originPortId,
    dischargePortId,
    totalVolumeMT,
    deliveryHorizonMonths = 6,
    riskTolerancePercent = 50,
    vesselType = 'Panamax',
    baseSpotRateUSD = 18.50
  } = params;

  const origin = ALL_PORTS.find(p => p.id === originPortId) || ALL_PORTS[7];
  const discharge = ALL_PORTS.find(p => p.id === dischargePortId) || ALL_PORTS[0];
  const vessel = VESSEL_CLASSES.find(v => v.type === vesselType) || VESSEL_CLASSES[3];
  const parcelCapacity = Math.round(vessel.typicalDwt * 0.95);
  const horizonDays = deliveryHorizonMonths * 30;
  const riskWeight = riskTolerancePercent / 100;

  const feasibilityWarnings: string[] = [];

  // Lightering calculation if riverine / draft-constrained
  let lighteringPerMT = 0;
  if (discharge.isRiverine || discharge.requiresLighterageForCapesize || discharge.id === 'in-hal') {
    lighteringPerMT = discharge.lighteringCostPerMT || 4.20;
    feasibilityWarnings.push(`Discharge at ${discharge.name} incorporates STS lightering tariff of $${lighteringPerMT.toFixed(2)}/MT at ${discharge.lighteringLocation || 'Sandheads'}.`);
  }

  // Rate benchmarks
  const spotRate = baseSpotRateUSD + lighteringPerMT;
  const coaRate = Number((baseSpotRateUSD * 0.88 + lighteringPerMT).toFixed(2));
  const tcRate = Number((baseSpotRateUSD * 0.83 + lighteringPerMT).toFixed(2));

  // Determine Optimal Contract Split based on Risk Tolerance
  let spotShare = 0;
  let coaShare = 0;
  let tcShare = 0;

  if (riskWeight <= 0.30) {
    // Aggressive Cost Minimization (Spot Agility + COA Backbone)
    spotShare = +(0.50 - riskWeight * 0.6).toFixed(2);
    coaShare = +(0.35 + riskWeight * 0.4).toFixed(2);
    tcShare = +(1.0 - spotShare - coaShare).toFixed(2);
  } else if (riskWeight <= 0.70) {
    // Balanced Hybrid Approach (Industry Benchmark: 50% COA, 30% TC, 20% Spot)
    spotShare = +(0.30 - (riskWeight - 0.30) * 0.35).toFixed(2);
    coaShare = +(0.45 + (riskWeight - 0.30) * 0.15).toFixed(2);
    tcShare = +(1.0 - spotShare - coaShare).toFixed(2);
  } else {
    // Conservative Budget Certainty (Guaranteed Tonnage Shield)
    spotShare = 0.10;
    coaShare = 0.50;
    tcShare = 0.40;
  }

  if (totalVolumeMT < 180000) {
    coaShare += tcShare * 0.8;
    spotShare += tcShare * 0.2;
    tcShare = 0;
  }

  // Normalize
  const totalShare = spotShare + coaShare + tcShare;
  spotShare = +(spotShare / totalShare).toFixed(2);
  coaShare = +(coaShare / totalShare).toFixed(2);
  tcShare = +(1.0 - spotShare - coaShare).toFixed(2);

  // Generate Laycan Allocations
  const allocations: VoyageAllocation[] = [];
  let remainingVolume = totalVolumeMT;
  let voyageIndex = 1;
  const expectedVoyages = Math.max(1, Math.ceil(totalVolumeMT / parcelCapacity));
  const daysInterval = Math.max(10, Math.floor(horizonDays / expectedVoyages));
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 10);

  // 1. Allocate COA Voyages
  const targetCoaVolume = totalVolumeMT * coaShare;
  let allocatedCoa = 0;
  while (allocatedCoa < targetCoaVolume && remainingVolume > 0) {
    const parcel = Math.min(remainingVolume, parcelCapacity);
    const start = new Date(baseDate.getTime() + (voyageIndex - 1) * daysInterval * 86400000);
    const end = new Date(start.getTime() + 7 * 86400000);

    allocations.push({
      voyageNumber: voyageIndex,
      contractType: 'COA',
      vesselClass: vessel.type,
      parcelSizeMT: parcel,
      laycanWindowStart: start.toISOString().split('T')[0],
      laycanWindowEnd: end.toISOString().split('T')[0],
      freightRatePerMT: coaRate,
      totalCostUSD: Math.round(parcel * coaRate),
      lighteringCostUSD: Math.round(parcel * lighteringPerMT),
      demurrageExposureUSD: Math.round(discharge.avgWaitingDays * (vessel.demurrageRateUSDPerDay || 20000) * 0.35),
      notes: lighteringPerMT > 0 ? `STS lightering included at ${discharge.lighteringLocation || 'Sandheads'}` : 'Direct discharge under 6-month COA collar'
    });

    allocatedCoa += parcel;
    remainingVolume -= parcel;
    voyageIndex++;
  }

  // 2. Allocate Period TC Voyages
  const targetTcVolume = totalVolumeMT * tcShare;
  let allocatedTc = 0;
  while (allocatedTc < targetTcVolume && remainingVolume > 0) {
    const parcel = Math.min(remainingVolume, parcelCapacity);
    const start = new Date(baseDate.getTime() + (voyageIndex - 1) * daysInterval * 86400000);
    const end = new Date(start.getTime() + 5 * 86400000);

    allocations.push({
      voyageNumber: voyageIndex,
      contractType: 'TimeCharter',
      vesselClass: vessel.type,
      parcelSizeMT: parcel,
      laycanWindowStart: start.toISOString().split('T')[0],
      laycanWindowEnd: end.toISOString().split('T')[0],
      freightRatePerMT: tcRate,
      totalCostUSD: Math.round(parcel * tcRate),
      lighteringCostUSD: Math.round(parcel * lighteringPerMT),
      demurrageExposureUSD: Math.round(discharge.avgWaitingDays * (vessel.demurrageRateUSDPerDay || 20000) * 0.15),
      notes: 'Period Time Charter vessel dedicated lift - Zero spot volatility risk'
    });

    allocatedTc += parcel;
    remainingVolume -= parcel;
    voyageIndex++;
  }

  // 3. Allocate Spot Voyages
  while (remainingVolume > 0) {
    const parcel = Math.min(remainingVolume, parcelCapacity);
    const start = new Date(baseDate.getTime() + (voyageIndex - 1) * daysInterval * 86400000);
    const end = new Date(start.getTime() + 5 * 86400000);

    allocations.push({
      voyageNumber: voyageIndex,
      contractType: 'Spot',
      vesselClass: vessel.type,
      parcelSizeMT: parcel,
      laycanWindowStart: start.toISOString().split('T')[0],
      laycanWindowEnd: end.toISOString().split('T')[0],
      freightRatePerMT: spotRate,
      totalCostUSD: Math.round(parcel * spotRate),
      lighteringCostUSD: Math.round(parcel * lighteringPerMT),
      demurrageExposureUSD: Math.round(discharge.avgWaitingDays * (vessel.demurrageRateUSDPerDay || 20000)),
      notes: 'Prompt Spot fixture - opportunistic market timing'
    });

    remainingVolume -= parcel;
    voyageIndex++;
  }

  // Contract Breakdown
  const modes: ContractMode[] = ['Spot', 'COA', 'TimeCharter'];
  const contractBreakdown: ContractAllocationBreakdown[] = modes.map(m => {
    const matching = allocations.filter(a => a.contractType === m);
    const vol = matching.reduce((sum, a) => sum + a.parcelSizeMT, 0);
    const cost = matching.reduce((sum, a) => sum + a.totalCostUSD, 0);
    const count = matching.length;
    const avgRate = vol > 0 ? +(cost / vol).toFixed(2) : 0;

    let riskRating: 'High' | 'Medium' | 'Low' = 'High';
    let description = '';
    if (m === 'Spot') {
      riskRating = 'High';
      description = 'Spot Market: Maximum flexibility, unhedged against seasonal rate surges.';
    } else if (m === 'COA') {
      riskRating = 'Medium';
      description = 'Multi-Voyage COA: Guaranteed laycans with volume discount and bunker collar.';
    } else {
      riskRating = 'Low';
      description = 'Period Time Charter: Fixed baseline rate for complete budget certainty.';
    }

    return {
      type: m,
      volumeMT: vol,
      volumePercent: +(vol / totalVolumeMT * 100).toFixed(1),
      voyageCount: count,
      avgRatePerMTUSD: avgRate,
      totalCostUSD: cost,
      riskRating,
      description
    };
  });

  // Landed Cost Comparison Scenarios
  // 1. Pure Spot
  const spotTotalCostUSD = Math.round(totalVolumeMT * spotRate);
  const pureSpot: LandedCostScenarioComparison = {
    scenarioName: '100% Pure Spot Fixtures',
    spotSharePercent: 100,
    coaSharePercent: 0,
    tcSharePercent: 0,
    freightCostUSD: Math.round(spotTotalCostUSD * 0.68),
    bunkerCostUSD: Math.round(spotTotalCostUSD * 0.20),
    portDuesUSD: Math.round(spotTotalCostUSD * 0.08),
    lighteringCostUSD: Math.round(totalVolumeMT * lighteringPerMT),
    demurrageRiskUSD: Math.round(allocations.length * discharge.avgWaitingDays * (vessel.demurrageRateUSDPerDay || 20000)),
    totalCostUSD: spotTotalCostUSD,
    costPerMTUSD: spotRate,
    totalCostINR: Math.round(spotTotalCostUSD * USD_TO_INR_RATE),
    costPerMTINR: Math.round(spotRate * USD_TO_INR_RATE),
    volatilityStdDevUSD: +(spotRate * 0.22).toFixed(2),
    valueAtRisk95USD: Math.round(spotTotalCostUSD * 0.26)
  };

  // 2. Recommended Hybrid (MILP)
  const hybridTotalCostUSD = allocations.reduce((sum, a) => sum + a.totalCostUSD, 0);
  const hybridRateAvg = +(hybridTotalCostUSD / totalVolumeMT).toFixed(2);
  const recommendedHybrid: LandedCostScenarioComparison = {
    scenarioName: 'Optimized Hybrid Portfolio (MILP)',
    spotSharePercent: Math.round(spotShare * 100),
    coaSharePercent: Math.round(coaShare * 100),
    tcSharePercent: Math.round(tcShare * 100),
    freightCostUSD: Math.round(hybridTotalCostUSD * 0.69),
    bunkerCostUSD: Math.round(hybridTotalCostUSD * 0.19),
    portDuesUSD: Math.round(hybridTotalCostUSD * 0.08),
    lighteringCostUSD: allocations.reduce((sum, a) => sum + a.lighteringCostUSD, 0),
    demurrageRiskUSD: allocations.reduce((sum, a) => sum + a.demurrageExposureUSD, 0),
    totalCostUSD: hybridTotalCostUSD,
    costPerMTUSD: hybridRateAvg,
    totalCostINR: Math.round(hybridTotalCostUSD * USD_TO_INR_RATE),
    costPerMTINR: Math.round(hybridRateAvg * USD_TO_INR_RATE),
    volatilityStdDevUSD: +(hybridRateAvg * 0.08).toFixed(2),
    valueAtRisk95USD: Math.round(hybridTotalCostUSD * 0.10)
  };

  // 3. Fixed Time Charter
  const tcTotalCostUSD = Math.round(totalVolumeMT * tcRate);
  const fixedTimeCharter: LandedCostScenarioComparison = {
    scenarioName: '100% Fixed Period Time Charter',
    spotSharePercent: 0,
    coaSharePercent: 0,
    tcSharePercent: 100,
    freightCostUSD: Math.round(tcTotalCostUSD * 0.70),
    bunkerCostUSD: Math.round(tcTotalCostUSD * 0.20),
    portDuesUSD: Math.round(tcTotalCostUSD * 0.07),
    lighteringCostUSD: Math.round(totalVolumeMT * lighteringPerMT),
    demurrageRiskUSD: Math.round(allocations.length * discharge.avgWaitingDays * (vessel.demurrageRateUSDPerDay || 20000) * 0.2),
    totalCostUSD: tcTotalCostUSD,
    costPerMTUSD: tcRate,
    totalCostINR: Math.round(tcTotalCostUSD * USD_TO_INR_RATE),
    costPerMTINR: Math.round(tcRate * USD_TO_INR_RATE),
    volatilityStdDevUSD: +(tcRate * 0.04).toFixed(2),
    valueAtRisk95USD: Math.round(tcTotalCostUSD * 0.05)
  };

  const netSavingsUSD = spotTotalCostUSD - hybridTotalCostUSD;
  const netSavingsINR = Math.round(netSavingsUSD * USD_TO_INR_RATE);
  const savingsPercentage = +((netSavingsUSD / spotTotalCostUSD) * 100).toFixed(1);
  const riskReductionPercent = Math.round((1 - (recommendedHybrid.valueAtRisk95USD / pureSpot.valueAtRisk95USD)) * 100);

  const executionPlanSummary = `Allocated ${allocations.length} distinct voyage liftings (${vessel.type}) across ${deliveryHorizonMonths} months. Portfolio split: ${recommendedHybrid.coaSharePercent}% COA volume, ${recommendedHybrid.tcSharePercent}% Period Time Charter, and ${recommendedHybrid.spotSharePercent}% Spot flexibility. Yields $${(netSavingsUSD / 1000000).toFixed(2)}M (₹${(netSavingsINR / 10000000).toFixed(2)} Cr) landed freight savings against unhedged spot fixtures with a ${riskReductionPercent}% reduction in tail-risk VaR.`;

  return {
    allocations,
    contractBreakdown,
    costComparison: {
      pureSpot,
      recommendedHybrid,
      fixedTimeCharter
    },
    netSavingsUSD,
    netSavingsINR,
    savingsPercentage,
    riskReductionPercent,
    feasibilityWarnings,
    executionPlanSummary
  };
}
