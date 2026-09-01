import { COAComparisonScenario, VesselType } from '../types/maritime';
import { VESSEL_CLASSES } from '../data/vesselData';

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

  // 3-Month COA (Quarterly - approx 3-4 voyages)
  const qtr3MoRate = Number((spotRate * 0.915).toFixed(2)); // ~8.5% discount due to volume commitment
  const qtr3MoSpend = Math.round(qtr3MoRate * annualVolumeMT);
  const qtr3MoSavings = spotTotalSpend - qtr3MoSpend;

  // 6-Month COA (Semi-annual - approx 6-8 voyages)
  const semi6MoRate = Number((spotRate * 0.865).toFixed(2)); // ~13.5% discount + bunker stabilization
  const semi6MoSpend = Math.round(semi6MoRate * annualVolumeMT);
  const semi6MoSavings = spotTotalSpend - semi6MoSpend;

  // 12-Month COA (Annual Contract of Affreightment)
  const annual12MoRate = Number((spotRate * 0.815).toFixed(2)); // ~18.5% discount + guaranteed laycan priority
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
      bunkerIndexationClause: 'Full BIMCO COA clause with guaranteed demurrage cap ($18,000/day)'
    }
  ];
}
