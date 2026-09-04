import { VirtualArrivalInput, VirtualArrivalResult, VesselType } from '../types/maritime';
import { VESSEL_CLASSES } from '../data/vesselData';

/**
 * Virtual Arrival & Green Steaming Hydrodynamic Simulator
 * Calculates fuel savings, CO2e abatement, and demurrage reduction when slowing down at sea
 * to absorb known destination port queue waiting times.
 */
export function calculateVirtualArrival(input: VirtualArrivalInput): VirtualArrivalResult {
  const {
    vesselType,
    distanceNM,
    originalSpeedKts,
    optimizedSpeedKts,
    knownPortDelayDays,
    vlsfoPriceUSD = 618
  } = input;

  const vessel = VESSEL_CLASSES.find(v => v.type === vesselType) || VESSEL_CLASSES[3];
  const designSpeed = vessel.ladenSpeedKnots || 13.0;
  const baseSeaFuel = vessel.fuelConsumptionAtSeaTonsPerDay;
  const basePortFuel = vessel.fuelConsumptionInPortTonsPerDay;
  const demurrageRate = vessel.demurrageRateUSDPerDay || 20000;
  const co2Factor = vessel.co2Factor || 3.114;

  // 1. Original "Rush & Wait" Profile (Full Fast Steaming)
  const origSeaDays = +(distanceNM / (originalSpeedKts * 24)).toFixed(2);
  const origSpeedRatio = originalSpeedKts / designSpeed;
  const origDailySeaBurn = baseSeaFuel * Math.pow(origSpeedRatio, 3);
  const origSeaFuelMT = origDailySeaBurn * origSeaDays;
  const origAnchorFuelMT = basePortFuel * knownPortDelayDays;
  const origTotalFuelMT = +(origSeaFuelMT + origAnchorFuelMT).toFixed(1);
  const origBunkerCostUSD = Math.round(origTotalFuelMT * vlsfoPriceUSD);
  const origDemurrageUSD = Math.round(knownPortDelayDays * demurrageRate);
  const origTotalCostUSD = origBunkerCostUSD + origDemurrageUSD;
  const origCO2MT = +(origTotalFuelMT * co2Factor).toFixed(1);

  // 2. Optimized "Virtual Arrival" Profile (Slow JIT Steaming)
  const optSeaDays = +(distanceNM / (optimizedSpeedKts * 24)).toFixed(2);
  const seaTimeDeltaDays = Math.max(0, optSeaDays - origSeaDays);
  const remainingAnchorDelayDays = +Math.max(0, knownPortDelayDays - seaTimeDeltaDays).toFixed(1);

  const optSpeedRatio = optimizedSpeedKts / designSpeed;
  const optDailySeaBurn = baseSeaFuel * Math.pow(optSpeedRatio, 3);
  const optSeaFuelMT = optDailySeaBurn * optSeaDays;
  const optAnchorFuelMT = basePortFuel * remainingAnchorDelayDays;
  const optTotalFuelMT = +(optSeaFuelMT + optAnchorFuelMT).toFixed(1);
  const optBunkerCostUSD = Math.round(optTotalFuelMT * vlsfoPriceUSD);
  const optDemurrageUSD = Math.round(remainingAnchorDelayDays * demurrageRate);
  const optTotalCostUSD = optBunkerCostUSD + optDemurrageUSD;
  const optCO2MT = +(optTotalFuelMT * co2Factor).toFixed(1);

  // 3. Net Savings & Abatement
  const fuelSavedMT = +Math.max(0, origTotalFuelMT - optTotalFuelMT).toFixed(1);
  const fuelSavedUSD = Math.max(0, origBunkerCostUSD - optBunkerCostUSD);
  const demurrageSavedUSD = Math.max(0, origDemurrageUSD - optDemurrageUSD);
  const netFinancialBenefitUSD = Math.max(0, origTotalCostUSD - optTotalCostUSD);
  const co2SavedMT = +Math.max(0, origCO2MT - optCO2MT).toFixed(1);

  // 4. IMO Carbon Intensity Indicator (CII) Rating Impact
  // CII = (Fuel * 3.114 * 10^6) / (DWT * Distance)
  const ciiBaseline = (origTotalFuelMT * 3.114 * 1000000) / (vessel.typicalDwt * distanceNM);
  const ciiOptimized = (optTotalFuelMT * 3.114 * 1000000) / (vessel.typicalDwt * distanceNM);
  const ciiReductionPercent = +(((ciiBaseline - ciiOptimized) / ciiBaseline) * 100).toFixed(1);

  let ciiOldGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
  let ciiNewGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  if (ciiReductionPercent >= 25) {
    ciiOldGrade = 'D';
    ciiNewGrade = 'A';
  } else if (ciiReductionPercent >= 15) {
    ciiOldGrade = 'C';
    ciiNewGrade = 'A';
  } else if (ciiReductionPercent >= 8) {
    ciiOldGrade = 'C';
    ciiNewGrade = 'B';
  }

  // 5. Backhaul Triangulation Opportunities to eliminate deadheading
  const backhaulRecommendations = [
    {
      originPort: 'Paradip / Dhamra (India)',
      backhaulDischargePort: 'Qingdao / Caofeidian (China)',
      commodity: 'Iron Ore Fines / Pellets Export',
      distanceNM: 4100,
      ballastDaysSaved: 9.5,
      projectedRevenueUSD: Math.round(vessel.typicalDwt * 0.95 * 11.20)
    },
    {
      originPort: 'Visakhapatnam / Gangavaram (India)',
      backhaulDischargePort: 'Ennore / Tuticorin (South India Coastal)',
      commodity: 'Domestic Coastal Thermal Coal',
      distanceNM: 480,
      ballastDaysSaved: 3.2,
      projectedRevenueUSD: Math.round(vessel.typicalDwt * 0.95 * 4.80)
    },
    {
      originPort: 'Haldia / Sagar Anchorage (India)',
      backhaulDischargePort: 'Singapore / Port Klang (Southeast Asia)',
      commodity: 'Steel Billets & Heavy Machinery',
      distanceNM: 1650,
      ballastDaysSaved: 5.0,
      projectedRevenueUSD: Math.round(vessel.typicalDwt * 0.95 * 8.50)
    }
  ];

  return {
    original: {
      speedKts: originalSpeedKts,
      seaDays: origSeaDays,
      anchorDays: knownPortDelayDays,
      totalFuelMT: origTotalFuelMT,
      bunkerCostUSD: origBunkerCostUSD,
      demurrageUSD: origDemurrageUSD,
      totalCostUSD: origTotalCostUSD,
      co2MT: origCO2MT
    },
    optimized: {
      speedKts: optimizedSpeedKts,
      seaDays: optSeaDays,
      anchorDays: remainingAnchorDelayDays,
      totalFuelMT: optTotalFuelMT,
      bunkerCostUSD: optBunkerCostUSD,
      demurrageUSD: optDemurrageUSD,
      totalCostUSD: optTotalCostUSD,
      co2MT: optCO2MT
    },
    savings: {
      fuelSavedMT,
      fuelSavedUSD,
      demurrageSavedUSD,
      netFinancialBenefitUSD,
      co2SavedMT,
      ciiReductionPercent,
      ciiOldGrade,
      ciiNewGrade
    },
    backhaulRecommendations
  };
}
