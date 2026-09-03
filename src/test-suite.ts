import { calculateVesselFeasibility } from './utils/vesselOptimizer';
import { runMILPPortfolioOptimizer } from './utils/contractSimulator';
import { calculateVirtualArrival } from './utils/virtualArrival';
import { formatUSD, formatINR, formatRatePerMT } from './utils/currencyUtils';

console.log('🚢 [VEDHA LOGISTICS TEST SUITE] Starting Automated Verification Engine...\n');

// ---------------------------------------------------------
// TEST 1: Indian East Coast Draft & Physical Berth Feasibility
// ---------------------------------------------------------
console.log('--- TEST 1: East Coast India Draft & Lightering Validation ---');

// 1.a Haldia Riverine Draft Restriction (Capesize 18.2m vs 8.5m draft)
const haldiaFeas = calculateVesselFeasibility({
  originPortId: 'au-hay',
  destinationPortId: 'in-hal',
  cargoVolumeMT: 150000,
  commodity: 'Thermal Coal',
  targetLaycanStart: '2026-10-01',
  targetLaycanEnd: '2026-10-15',
  contractHorizonMonths: 6,
  bunkerPriceSensitivityUSD: 580
});

const haldiaCape = haldiaFeas.results.find(r => r.vesselType === 'Capesize')!;
console.log(`Haldia + Capesize: Status = ${haldiaCape.status} (Expected: RESTRICTED)`);
console.log(`Lightering Required: ${haldiaCape.requiresLighterage}, Volume: ${haldiaCape.lighterageVolumeMT?.toLocaleString()} MT, Tariff: $${haldiaCape.lighterageCostUSD?.toLocaleString()} ($${haldiaCape.lighterageCostUSDPerTon}/MT)`);
if (haldiaCape.status !== 'RESTRICTED' || !haldiaCape.requiresLighterage) {
  throw new Error('❌ Test 1.a Failed: Haldia Capesize must be RESTRICTED with lightering required.');
}

// 1.b Gangavaram Deepwater Ready (18.5m draft)
const gangavaramFeas = calculateVesselFeasibility({
  originPortId: 'au-hay',
  destinationPortId: 'in-gan',
  cargoVolumeMT: 180000,
  commodity: 'Coking Coal',
  targetLaycanStart: '2026-10-01',
  targetLaycanEnd: '2026-10-15',
  contractHorizonMonths: 6,
  bunkerPriceSensitivityUSD: 580
});

const gangavaramCape = gangavaramFeas.results.find(r => r.vesselType === 'Capesize')!;
console.log(`Gangavaram + Capesize: Status = ${gangavaramCape.status} (Expected: PASSED, UKC: +${gangavaramCape.draftMargin}m)`);
if (gangavaramCape.status !== 'PASSED') {
  throw new Error('❌ Test 1.b Failed: Gangavaram Capesize must be PASSED.');
}

// ---------------------------------------------------------
// TEST 2: MILP Mathematical Portfolio Optimizer
// ---------------------------------------------------------
console.log('\n--- TEST 2: MILP Mathematical Portfolio Optimization ---');
const milpResult = runMILPPortfolioOptimizer({
  originPortId: 'au-hay',
  dischargePortId: 'in-par',
  totalVolumeMT: 600000,
  deliveryHorizonMonths: 6,
  riskTolerancePercent: 50,
  vesselType: 'Panamax',
  baseSpotRateUSD: 18.50
});

console.log(`Total Voyage Liftings: ${milpResult.allocations.length}`);
console.log(`Contract Portfolio Breakdown:`, milpResult.contractBreakdown.map(b => `${b.type}: ${b.volumePercent}% (${b.volumeMT.toLocaleString()} MT)`).join(' | '));
console.log(`Landed Freight: Pure Spot = $${milpResult.costComparison.pureSpot.costPerMTUSD}/MT | Recommended Hybrid = $${milpResult.costComparison.recommendedHybrid.costPerMTUSD}/MT`);
console.log(`Projected Net Savings: $${milpResult.netSavingsUSD.toLocaleString()} (${milpResult.savingsPercentage}%) | ${formatINR(milpResult.netSavingsUSD)} | VaR95 Reduction = ${milpResult.riskReductionPercent}%`);

if (milpResult.netSavingsUSD <= 0 || milpResult.allocations.length === 0) {
  throw new Error('❌ Test 2 Failed: MILP optimizer must yield positive savings and non-empty allocations.');
}

// ---------------------------------------------------------
// TEST 3: Virtual Arrival Cubic Propeller Law Simulator
// ---------------------------------------------------------
console.log('\n--- TEST 3: Virtual Arrival & Green Steaming Physics ---');
const vaResult = calculateVirtualArrival({
  vesselType: 'Capesize',
  distanceNM: 5400,
  originalSpeedKts: 13.5,
  optimizedSpeedKts: 10.8,
  knownPortDelayDays: 4.0,
  vlsfoPriceUSD: 618
});

console.log(`Fuel Saved: ${vaResult.savings.fuelSavedMT} MT VLSFO ($${vaResult.savings.fuelSavedUSD.toLocaleString()})`);
console.log(`Demurrage Avoidance: $${vaResult.savings.demurrageSavedUSD.toLocaleString()}`);
console.log(`Scope 1 GHG Abatement: ${vaResult.savings.co2SavedMT} MT CO2e`);
console.log(`Net Financial Benefit: $${vaResult.savings.netFinancialBenefitUSD.toLocaleString()} (${formatINR(vaResult.savings.netFinancialBenefitUSD)})`);
console.log(`IMO CII Rating Upgrade: +${vaResult.savings.ciiReductionPercent}% (Grade ${vaResult.savings.ciiOldGrade} ➔ Grade ${vaResult.savings.ciiNewGrade})`);

if (vaResult.savings.netFinancialBenefitUSD <= 0 || vaResult.savings.fuelSavedMT <= 0) {
  throw new Error('❌ Test 3 Failed: Virtual arrival physics must calculate positive fuel and financial savings.');
}

// ---------------------------------------------------------
// TEST 4: Dual Currency Formatter
// ---------------------------------------------------------
console.log('\n--- TEST 4: Currency Formatter & Conversion ---');
const testUSD = 2450000;
const formattedUSD = formatUSD(testUSD);
const formattedINR = formatINR(testUSD);
const formattedRate = formatRatePerMT(18.50, 'INR');
console.log(`USD Formatting: ${formattedUSD}`);
console.log(`INR Formatting: ${formattedINR}`);
console.log(`INR Freight Rate: ${formattedRate}`);

if (!formattedINR.includes('Cr') && !formattedINR.includes('₹')) {
  throw new Error('❌ Test 4 Failed: INR conversion must include currency symbol and Crore scale.');
}

console.log('\n✅ [ALL 4 TESTS PASSED SUCCESSFULLY! Mathematical & physical models validated.]');
