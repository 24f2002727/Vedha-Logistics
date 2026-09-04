import {
  PortDetails,
  VesselFeasibilityResult,
  VesselOptimizationInput,
  VesselType,
  FeasibilityStatus,
  WaterColumnProfile
} from '../types/maritime';
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
  const origin = ALL_PORTS.find(p => p.id === input.originPortId) || ALL_PORTS[7];
  const dest = ALL_PORTS.find(p => p.id === input.destinationPortId) || ALL_PORTS[0];
  const route = TRADE_ROUTES.find(r => r.originPortId === input.originPortId && r.destinationPortId === input.destinationPortId) ||
    TRADE_ROUTES.find(r => r.originCountry === origin?.country && r.destinationPortId === input.destinationPortId) ||
    TRADE_ROUTES[0];

  const distance = route ? route.distanceNauticalMiles : 5000;
  const bunkerPrice = input.bunkerPriceSensitivityUSD || 580; // $/ton

  const results: VesselFeasibilityResult[] = VESSEL_CLASSES.map(vessel => {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let status: FeasibilityStatus = 'PASSED';
    let isFeasible = true;
    let requiresLighterage = false;
    let lighterageVolumeMT = 0;
    let lighterageCostUSD = 0;
    let lighterageCostPerTon = 0;
    let lighterageLocation = dest?.lighteringLocation || 'Sandheads / Dhamra Offshore';

    const cargoLiftedMT = Math.min(input.cargoVolumeMT, vessel.typicalDwt * 0.95);
    const draftMargin = +(dest.maxDraft - vessel.typicalDraft).toFixed(2);
    const loaMargin = +(dest.maxLOA - vessel.typicalLOA).toFixed(1);
    const beamMargin = +(dest.maxBeam - vessel.typicalBeam).toFixed(1);

    // 1. Destination Draft and Tidal / Riverine Feasibility
    let draftPass = true;
    if (draftMargin < 0) {
      draftPass = false;
      if (dest.isRiverine || dest.requiresLighterageForCapesize || dest.id === 'in-hal') {
        // Riverine / Lightering port (e.g. Haldia / Sagar-Sandheads)
        status = 'RESTRICTED';
        requiresLighterage = true;
        const targetDraft = dest.maxDraft - 0.5;
        const excessDraft = Math.max(0.5, vessel.typicalDraft - targetDraft);
        const draftFraction = Math.min(0.65, excessDraft / vessel.typicalDraft);
        lighterageVolumeMT = Math.round(cargoLiftedMT * draftFraction);
        lighterageCostPerTon = dest.lighteringCostPerMT || 4.20;
        lighterageCostUSD = Math.round(lighterageVolumeMT * lighterageCostPerTon);
        lighterageLocation = dest.lighteringLocation || 'Sagar-Sandheads Anchorage / Dhamra Transshipment';

        reasons.push(`Vessel loaded draft (${vessel.typicalDraft}m) exceeds permissible chart datum (${dest.maxDraft}m) by ${Math.abs(draftMargin)}m.`);
        reasons.push(`Mandatory STS lightering of ${lighterageVolumeMT.toLocaleString()} MT required at ${lighterageLocation}.`);
        recommendations.push(`Execute lightering at ${lighterageLocation} ($${lighterageCostPerTon.toFixed(2)}/MT) or transship at deepwater hub (Dhamra/Gangavaram).`);
      } else if (draftMargin < -2.0) {
        // Severe deficit in non-lightering standard berth
        status = 'REJECTED';
        isFeasible = false;
        reasons.push(`Severe draft deficit of ${Math.abs(draftMargin)}m exceeds permissible under-keel safety limits.`);
        recommendations.push(`Nominate smaller compliant vessel (e.g. ${dest.permittedVesselTypes.join(', ')}) or divert to deepwater hub.`);
      } else {
        // Moderate deficit -> Lightering / two-port discharge
        status = 'RESTRICTED';
        requiresLighterage = true;
        lighterageVolumeMT = Math.round(cargoLiftedMT * 0.25);
        lighterageCostPerTon = 4.50;
        lighterageCostUSD = Math.round(lighterageVolumeMT * lighterageCostPerTon);
        reasons.push(`Draft clearance is tight (${draftMargin}m). Partial top-off discharge required.`);
        recommendations.push(`Discharge top-off parcel at nearby deepwater port before final berthing at ${dest.name}.`);
      }
    } else if (draftMargin < 1.0) {
      reasons.push(`Tight Under-Keel Clearance (UKC) of +${draftMargin}m. High-water tidal window required.`);
      recommendations.push(`Coordinate with port pilot for high tide transit window.`);
    } else {
      reasons.push(`Full draft clearance passed with +${draftMargin}m UKC safety margin.`);
      recommendations.push(`Nominate for unconstrained direct berthing at ${dest.name}.`);
    }

    // 2. Physical LOA & Beam Lock Checks
    let loaPass = true;
    if (loaMargin < 0 || beamMargin < 0) {
      loaPass = false;
      if (!requiresLighterage) {
        status = 'REJECTED';
        isFeasible = false;
        if (loaMargin < 0) reasons.push(`Vessel LOA (${vessel.typicalLOA}m) exceeds berth limit (${dest.maxLOA}m).`);
        if (beamMargin < 0) reasons.push(`Vessel Beam (${vessel.typicalBeam}m) exceeds berth limit (${dest.maxBeam}m).`);
        recommendations.push(`Select vessel class with compliant dimensions (max ${dest.maxLOA}m LOA).`);
      }
    }

    // 3. Origin Gearless / Geared Crane Check
    if (origin && origin.berthType.includes('Offshore Anchorage') && !vessel.isGeared) {
      if (status === 'PASSED') status = 'RESTRICTED';
      reasons.push(`Origin is offshore anchorage. Gearless vessel requires floating crane barges.`);
      recommendations.push(`Charter geared Ultramax/Supramax or contract floating crane barge service (+0.65 $/t).`);
      lighterageCostPerTon += 0.65;
    }

    // 4. Hydrodynamics, Voyage Duration, and Fuel
    const seaDaysOneWay = distance / (vessel.ladenSpeedKnots * 24);
    const ballastDays = distance / (vessel.ballastSpeedKnots * 24);
    const originLoadingDays = (cargoLiftedMT) / (origin.cargoHandlingRateTPD || 40000);
    const destDischargeDays = (cargoLiftedMT) / (dest.cargoHandlingRateTPD || 25000);
    const waitingDays = (origin.avgWaitingDays || 2) + (dest.avgWaitingDays || 2);

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
    const totalVoyageSpendUSD = totalCharterHireUSD + fuelCostUSD + portDisbursementAndCanalUSD + lighterageCostUSD;

    const baseFreightPerTonUSD = Number(( (totalCharterHireUSD + fuelCostUSD + portDisbursementAndCanalUSD) / cargoLiftedMT).toFixed(2));
    const effectiveFreightPerTonUSD = Number((totalVoyageSpendUSD / cargoLiftedMT).toFixed(2));

    // Demurrage & Weather Risk
    let demurrageRiskProbability = 12; // Base %
    if (dest.congestionStatus === 'Moderate') demurrageRiskProbability += 10;
    if (dest.congestionStatus === 'High') demurrageRiskProbability += 22;
    if (dest.congestionStatus === 'Severe') demurrageRiskProbability += 38;
    if (dest.monsoonSensitivity === 'High') demurrageRiskProbability += 15;

    const demurrageExposureUSD = Math.round(dest.avgWaitingDays * vessel.demurrageRateUSDPerDay);

    // CO2 calculation
    const co2EmissionsTons = Math.round(totalFuelTons * vessel.co2Factor);

    // Water Column Depth Profile (Scale 0m to 22m Chart Datum)
    const maxDepthScale = 22.0;
    const waterColumn: WaterColumnProfile = {
      maxDepthScale,
      vesselDraftPercent: Math.min(100, (vessel.typicalDraft / maxDepthScale) * 100),
      portDraftPercent: Math.min(100, (dest.maxDraft / maxDepthScale) * 100),
      draftMargin,
      isDraftExceeded: vessel.typicalDraft > dest.maxDraft,
      draftDeficit: Math.max(0, vessel.typicalDraft - dest.maxDraft),
      safeUKCMarginMeters: Math.max(0, draftMargin)
    };

    // Feasibility score (0-100)
    let feasibilityScore = isFeasible ? 85 : 15;
    if (draftPass && loaPass) feasibilityScore += 10;
    if (requiresLighterage) feasibilityScore -= 12;
    if (input.cargoVolumeMT >= 120000 && (vessel.type === 'Capesize' || vessel.type === 'Kamsarmax')) feasibilityScore += 15;
    if (input.cargoVolumeMT < 60000 && vessel.type === 'Capesize') feasibilityScore -= 30;
    if (input.cargoVolumeMT <= 50000 && (vessel.type === 'Supramax' || vessel.type === 'Handysize')) feasibilityScore += 20;

    feasibilityScore = Math.min(100, Math.max(0, feasibilityScore));

    return {
      vesselType: vessel.type,
      status,
      isFeasible: status !== 'REJECTED',
      feasibilityScore,
      reasons,
      recommendations,
      draftMargin,
      loaMargin,
      beamMargin,
      draftConstraintPassed: draftPass,
      loaConstraintPassed: loaPass,
      handlingEfficiencyScore: Math.round(((dest.cargoHandlingRateTPD || 25000) / 45000) * 100),
      requiresLighterage,
      lighterageVolumeMT: requiresLighterage ? lighterageVolumeMT : undefined,
      lighterageCostUSD: requiresLighterage ? lighterageCostUSD : undefined,
      lighterageCostUSDPerTon: lighterageCostPerTon,
      lighterageLocation,
      baseFreightPerTonUSD,
      effectiveFreightPerTonUSD,
      totalVoyageSpendUSD,
      totalVoyageDays,
      fuelCostUSD,
      demurrageRiskProbability: Math.min(95, demurrageRiskProbability),
      demurrageExposureUSD,
      co2EmissionsTons,
      isRecommended: false,
      waterColumn
    };
  });

  // Select recommended vessel
  const sorted = [...results]
    .filter(r => r.status !== 'REJECTED')
    .sort((a, b) => {
      // Balance lowest effective freight per ton with highest feasibility score
      const scoreA = a.feasibilityScore * 0.45 + (100 - a.effectiveFreightPerTonUSD * 2.2) * 0.55;
      const scoreB = b.feasibilityScore * 0.45 + (100 - b.effectiveFreightPerTonUSD * 2.2) * 0.55;
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
