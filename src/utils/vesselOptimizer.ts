import { PortDetails, VesselFeasibilityResult, VesselOptimizationInput, VesselType } from '../types/maritime';
import { ALL_PORTS } from '../data/portsData';
import { VESSEL_CLASSES } from '../data/vesselData';
import { TRADE_ROUTES } from '../data/tradeRoutesData';

export function calculateVesselFeasibility(input: VesselOptimizationInput): {
  results: VesselFeasibilityResult[];
  recommendedVessel: VesselFeasibilityResult | null;
  originPort: PortDetails | undefined;
  destPort: PortDetails | undefined;
  route: typeof TRADE_ROUTES[0] | undefined;
} {
  const origin = ALL_PORTS.find(p => p.id === input.originPortId);
  const dest = ALL_PORTS.find(p => p.id === input.destinationPortId);
  const route = TRADE_ROUTES.find(r => r.originPortId === input.originPortId && r.destinationPortId === input.destinationPortId) ||
    TRADE_ROUTES.find(r => r.originCountry === origin?.country && r.destinationPortId === input.destinationPortId) ||
    TRADE_ROUTES[0];

  const distance = route ? route.distanceNauticalMiles : 5000;
  const bunkerPrice = input.bunkerPriceSensitivityUSD || 580; // $/ton

  const results: VesselFeasibilityResult[] = VESSEL_CLASSES.map(vessel => {
    const reasons: string[] = [];
    let isFeasible = true;
    let requiresLighterage = false;
    let lighterageCostPerTon = 0;

    // 1. Draft Check at Origin & Destination
    let draftPass = true;
    if (origin && vessel.typicalDraft > origin.maxDraft) {
      draftPass = false;
      isFeasible = false;
      reasons.push(`Exceeds origin port max draft (${origin.name}: ${origin.maxDraft}m vs vessel laden draft ${vessel.typicalDraft}m)`);
    }

    if (dest && vessel.typicalDraft > dest.maxDraft) {
      draftPass = false;
      // If it's Haldia or Sagar or deep port with lighterage capability:
      if (dest.requiresLighterageForCapesize || dest.isRiverine) {
        requiresLighterage = true;
        lighterageCostPerTon = 4.20; // Transshipment + daughter vessel barge cost $/ton
        reasons.push(`Exceeds direct draft at ${dest.name} (${dest.maxDraft}m). Lighterage required at Sagar / Sandheads anchorage.`);
      } else {
        isFeasible = false;
        reasons.push(`Exceeds destination max draft (${dest.name}: ${dest.maxDraft}m vs vessel laden draft ${vessel.typicalDraft}m)`);
      }
    }

    // 2. LOA & Beam Check
    let loaPass = true;
    if (origin && vessel.typicalLOA > origin.maxLOA) {
      loaPass = false;
      isFeasible = false;
      reasons.push(`Exceeds origin LOA limit (${origin.name}: max ${origin.maxLOA}m vs vessel ${vessel.typicalLOA}m)`);
    }
    if (dest && vessel.typicalLOA > dest.maxLOA) {
      loaPass = false;
      if (!requiresLighterage) {
        isFeasible = false;
        reasons.push(`Exceeds destination LOA limit (${dest.name}: max ${dest.maxLOA}m vs vessel ${vessel.typicalLOA}m)`);
      }
    }

    // 3. Geared vs Gearless Check (e.g. Indonesian anchorages)
    if (origin && origin.berthType.includes('Offshore Anchorage') && !vessel.isGeared) {
      reasons.push(`Note: Origin is offshore anchorage. Gearless vessel requires floating crane barges (+0.65 $/t).`);
      lighterageCostPerTon += 0.65;
    }

    // 4. Voyage duration and fuel calculations
    const seaDaysOneWay = distance / (vessel.ladenSpeedKnots * 24);
    const ballastDays = distance / (vessel.ballastSpeedKnots * 24);
    const originLoadingDays = (vessel.typicalDwt * 0.95) / (origin ? origin.cargoHandlingRateTPD : 40000);
    const destDischargeDays = (vessel.typicalDwt * 0.95) / (dest ? dest.cargoHandlingRateTPD : 25000);
    const waitingDays = (origin?.avgWaitingDays || 2) + (dest?.avgWaitingDays || 2);

    const totalVoyageDays = Math.ceil(seaDaysOneWay + ballastDays + originLoadingDays + destDischargeDays + waitingDays);

    // Fuel consumed
    const totalSeaFuelTons = (seaDaysOneWay + ballastDays) * vessel.fuelConsumptionAtSeaTonsPerDay;
    const totalPortFuelTons = (originLoadingDays + destDischargeDays + waitingDays) * vessel.fuelConsumptionInPortTonsPerDay;
    const totalFuelTons = totalSeaFuelTons + totalPortFuelTons;
    const fuelCostUSD = Math.round(totalFuelTons * bunkerPrice);

    // Daily charter hire cost
    let dailyHireRate = vessel.dailyCharterRateSpotUSD;
    if (input.contractHorizonMonths === 3) dailyHireRate = vessel.dailyCharterRate3MoCOAUSD;
    else if (input.contractHorizonMonths >= 6) dailyHireRate = vessel.dailyCharterRate12MoCOAUSD;

    const totalCharterHireUSD = dailyHireRate * totalVoyageDays;
    const portDisbursementAndCanalUSD = 180000 + (vessel.typicalDwt * 1.5);
    const totalVoyageSpendUSD = totalCharterHireUSD + fuelCostUSD + portDisbursementAndCanalUSD;

    const cargoLiftedMT = Math.min(input.cargoVolumeMT, vessel.typicalDwt * 0.95);
    const baseFreightPerTonUSD = Number((totalVoyageSpendUSD / cargoLiftedMT).toFixed(2));
    const effectiveFreightPerTonUSD = Number((baseFreightPerTonUSD + lighterageCostPerTon).toFixed(2));

    // Demurrage & Weather Risk
    let demurrageRiskProbability = 12; // Base %
    if (dest?.congestionStatus === 'High') demurrageRiskProbability += 22;
    if (dest?.congestionStatus === 'Severe') demurrageRiskProbability += 38;
    if (dest?.monsoonSensitivity === 'High') demurrageRiskProbability += 15;

    // CO2 calculation (approx 3.114 tons CO2 per ton of VLSFO)
    const co2EmissionsTons = Math.round(totalFuelTons * 3.114);

    // Feasibility score (0-100)
    let feasibilityScore = isFeasible ? 85 : 20;
    if (draftPass && loaPass) feasibilityScore += 10;
    if (requiresLighterage) feasibilityScore -= 15;
    if (input.cargoVolumeMT > 100000 && vessel.type === 'Capesize') feasibilityScore += 15;
    if (input.cargoVolumeMT < 50000 && vessel.type === 'Capesize') feasibilityScore -= 35;
    if (input.cargoVolumeMT <= 45000 && (vessel.type === 'Supramax' || vessel.type === 'Handysize')) feasibilityScore += 20;

    feasibilityScore = Math.min(100, Math.max(0, feasibilityScore));

    return {
      vesselType: vessel.type,
      isFeasible: isFeasible || requiresLighterage,
      feasibilityScore,
      reasons,
      draftConstraintPassed: draftPass,
      loaConstraintPassed: loaPass,
      handlingEfficiencyScore: Math.round(((dest?.cargoHandlingRateTPD || 25000) / 45000) * 100),
      requiresLighterage,
      lighterageCostUSDPerTon: lighterageCostPerTon,
      baseFreightPerTonUSD,
      effectiveFreightPerTonUSD,
      totalVoyageSpendUSD,
      totalVoyageDays,
      fuelCostUSD,
      demurrageRiskProbability: Math.min(95, demurrageRiskProbability),
      co2EmissionsTons,
      isRecommended: false
    };
  });

  // Pick the recommended vessel
  const sorted = [...results]
    .filter(r => r.isFeasible)
    .sort((a, b) => {
      // Balance lowest effective freight per ton with highest feasibility score
      const scoreA = a.feasibilityScore * 0.4 + (100 - a.effectiveFreightPerTonUSD * 2) * 0.6;
      const scoreB = b.feasibilityScore * 0.4 + (100 - b.effectiveFreightPerTonUSD * 2) * 0.6;
      return scoreB - scoreA;
    });

  let recommended = sorted[0] || results[0];
  if (recommended) {
    const recIndex = results.findIndex(r => r.vesselType === recommended.vesselType);
    if (recIndex !== -1) {
      results[recIndex].isRecommended = true;
      recommended = results[recIndex];
    }
  }

  return {
    results,
    recommendedVessel: recommended,
    originPort: origin,
    destPort: dest,
    route
  };
}
