import { BalticIndexForecastPoint, MarketTimingSignal } from '../types/maritime';

export const BALTIC_INDICES_HISTORY_AND_FORECAST: Record<string, BalticIndexForecastPoint[]> = {
  BDI: [
    { month: 'Oct 2025', dateStr: '2025-10', historical: 1820, forecast: 1820, confidenceLower: 1780, confidenceUpper: 1860, driverNotes: 'Post-monsoon Indian coal replenishment push' },
    { month: 'Nov 2025', dateStr: '2025-11', historical: 1940, forecast: 1940, confidenceLower: 1890, confidenceUpper: 1990, driverNotes: 'Strong Atlantic grain & Pacific mineral flows' },
    { month: 'Dec 2025', dateStr: '2025-12', historical: 2110, forecast: 2110, confidenceLower: 2040, confidenceUpper: 2180, driverNotes: 'Year-end Capesize spike on Chinese iron ore restocking' },
    { month: 'Jan 2026', dateStr: '2026-01', historical: 1680, forecast: 1680, confidenceLower: 1620, confidenceUpper: 1740, driverNotes: 'Seasonal winter slump and Chinese New Year pre-slowdown' },
    { month: 'Feb 2026', dateStr: '2026-02', historical: 1450, forecast: 1450, confidenceLower: 1390, confidenceUpper: 1510, driverNotes: 'Annual cyclical trough; optimal COA booking window' },
    { month: 'Mar 2026', dateStr: '2026-03', historical: 1720, forecast: 1720, confidenceLower: 1650, confidenceUpper: 1790, driverNotes: 'Spring industrial restart across East Asia and India' },
    { month: 'Apr 2026', dateStr: '2026-04', historical: 1890, forecast: 1890, confidenceLower: 1810, confidenceUpper: 1970, driverNotes: 'Strong South American grain export peak' },
    { month: 'May 2026', dateStr: '2026-05', historical: 1950, forecast: 1950, confidenceLower: 1860, confidenceUpper: 2040, driverNotes: 'Pre-monsoon thermal power coal stockpiling in India' },
    { month: 'Jun 2026', dateStr: '2026-06', historical: 1780, forecast: 1780, confidenceLower: 1690, confidenceUpper: 1870, driverNotes: 'Monsoon onset causing port discharge slowdowns' },
    { month: 'Jul 2026', dateStr: '2026-07', historical: 1690, forecast: 1690, confidenceLower: 1600, confidenceUpper: 1780, driverNotes: 'Mid-monsoon reduced coastal movements' },
    { month: 'Aug 2026', dateStr: '2026-08', historical: 1740, forecast: 1740, confidenceLower: 1640, confidenceUpper: 1840, driverNotes: 'Late monsoon recovery' },
    { month: 'Sep 2026', dateStr: '2026-09', forecast: 1880, confidenceLower: 1750, confidenceUpper: 2010, driverNotes: 'Current Month Forecast: Industrial ramp up' },
    { month: 'Oct 2026', dateStr: '2026-10', forecast: 2020, confidenceLower: 1860, confidenceUpper: 2180, driverNotes: '30-Day Forecast: Strong festival season & thermal demand' },
    { month: 'Nov 2026', dateStr: '2026-11', forecast: 2150, confidenceLower: 1950, confidenceUpper: 2350, driverNotes: '60-Day Forecast: Peak Atlantic-Pacific fixtures tightening vessel supply' },
    { month: 'Dec 2026', dateStr: '2026-12', forecast: 2280, confidenceLower: 2040, confidenceUpper: 2520, driverNotes: '90-Day Forecast: Year-end shipping surge & weather disruptions' },
    { month: 'Jan 2027', dateStr: '2027-01', forecast: 1790, confidenceLower: 1560, confidenceUpper: 2020, driverNotes: '120-Day Forecast: Seasonal softening' },
    { month: 'Feb 2027', dateStr: '2027-02', forecast: 1510, confidenceLower: 1290, confidenceUpper: 1730, driverNotes: '150-Day Forecast: Q1 cyclic bottom' },
    { month: 'Mar 2027', dateStr: '2027-03', forecast: 1760, confidenceLower: 1480, confidenceUpper: 2040, driverNotes: '180-Day Forecast: Spring recovery and new industrial contracts' }
  ],
  BCI: [
    // Capesize Index
    { month: 'Oct 2025', dateStr: '2025-10', historical: 2650, forecast: 2650, confidenceLower: 2550, confidenceUpper: 2750, driverNotes: 'Heavy iron ore shipments from Australia & Brazil' },
    { month: 'Nov 2025', dateStr: '2025-11', historical: 2980, forecast: 2980, confidenceLower: 2850, confidenceUpper: 3110, driverNotes: 'Tight supply in Atlantic basin' },
    { month: 'Dec 2025', dateStr: '2025-12', historical: 3340, forecast: 3340, confidenceLower: 3180, confidenceUpper: 3500, driverNotes: 'Peak Q4 Capesize volatility' },
    { month: 'Jan 2026', dateStr: '2026-01', historical: 2250, forecast: 2250, confidenceLower: 2120, confidenceUpper: 2380, driverNotes: 'Capesize demand drop' },
    { month: 'Feb 2026', dateStr: '2026-02', historical: 1820, forecast: 1820, confidenceLower: 1700, confidenceUpper: 1940, driverNotes: 'Low seasonal Capesize activity' },
    { month: 'Mar 2026', dateStr: '2026-03', historical: 2410, forecast: 2410, confidenceLower: 2280, confidenceUpper: 2540, driverNotes: 'Australian wet season ends' },
    { month: 'Apr 2026', dateStr: '2026-04', historical: 2750, forecast: 2750, confidenceLower: 2600, confidenceUpper: 2900, driverNotes: 'Brazil Vale ramp-up' },
    { month: 'May 2026', dateStr: '2026-05', historical: 2890, forecast: 2890, confidenceLower: 2720, confidenceUpper: 3060, driverNotes: 'Indian deep draft imports (Dhamra/Gangavaram)' },
    { month: 'Jun 2026', dateStr: '2026-06', historical: 2520, forecast: 2520, confidenceLower: 2360, confidenceUpper: 2680, driverNotes: 'Monsoon berthing slowdowns' },
    { month: 'Jul 2026', dateStr: '2026-07', historical: 2380, forecast: 2380, confidenceLower: 2210, confidenceUpper: 2550, driverNotes: 'Mid-summer lull' },
    { month: 'Aug 2026', dateStr: '2026-08', historical: 2490, forecast: 2490, confidenceLower: 2310, confidenceUpper: 2670, driverNotes: 'Pacific tonnage repositioning' },
    { month: 'Sep 2026', dateStr: '2026-09', forecast: 2720, confidenceLower: 2500, confidenceUpper: 2940, driverNotes: 'Current Month: Q4 fixture buildup' },
    { month: 'Oct 2026', dateStr: '2026-10', forecast: 3050, confidenceLower: 2780, confidenceUpper: 3320, driverNotes: '30-Day: Australia-India Capesize rate surge (+12%)' },
    { month: 'Nov 2026', dateStr: '2026-11', forecast: 3380, confidenceLower: 3020, confidenceUpper: 3740, driverNotes: '60-Day: Tight tonnage availability in Pacific' },
    { month: 'Dec 2026', dateStr: '2026-12', forecast: 3620, confidenceLower: 3200, confidenceUpper: 4040, driverNotes: '90-Day: Seasonal peak Capesize volatility' },
    { month: 'Jan 2027', dateStr: '2027-01', forecast: 2450, confidenceLower: 2080, confidenceUpper: 2820, driverNotes: '120-Day: Fast correction' },
    { month: 'Feb 2027', dateStr: '2027-02', forecast: 1980, confidenceLower: 1650, confidenceUpper: 2310, driverNotes: '150-Day: Optimal long-term COA fixing window' },
    { month: 'Mar 2027', dateStr: '2027-03', forecast: 2480, confidenceLower: 2050, confidenceUpper: 2910, driverNotes: '180-Day: Rebound on global steel production' }
  ],
  BPI: [
    // Panamax Index
    { month: 'Oct 2025', dateStr: '2025-10', historical: 1650, forecast: 1650, confidenceLower: 1600, confidenceUpper: 1700, driverNotes: 'Panamax steady on grain & coal' },
    { month: 'Nov 2025', dateStr: '2025-11', historical: 1780, forecast: 1780, confidenceLower: 1720, confidenceUpper: 1840, driverNotes: 'US Gulf coal loadings' },
    { month: 'Dec 2025', dateStr: '2025-12', historical: 1890, forecast: 1890, confidenceLower: 1820, confidenceUpper: 1960, driverNotes: 'High Panamax utilization' },
    { month: 'Jan 2026', dateStr: '2026-01', historical: 1540, forecast: 1540, confidenceLower: 1480, confidenceUpper: 1600, driverNotes: 'Winter slowdown' },
    { month: 'Feb 2026', dateStr: '2026-02', historical: 1380, forecast: 1380, confidenceLower: 1320, confidenceUpper: 1440, driverNotes: 'Market dip' },
    { month: 'Mar 2026', dateStr: '2026-03', historical: 1620, forecast: 1620, confidenceLower: 1550, confidenceUpper: 1690, driverNotes: 'South American grain season begins' },
    { month: 'Apr 2026', dateStr: '2026-04', historical: 1790, forecast: 1790, confidenceLower: 1710, confidenceUpper: 1870, driverNotes: 'East Coast India Panamax imports surge' },
    { month: 'May 2026', dateStr: '2026-05', historical: 1840, forecast: 1840, confidenceLower: 1750, confidenceUpper: 1930, driverNotes: 'Pre-monsoon coal stockpiles' },
    { month: 'Jun 2026', dateStr: '2026-06', historical: 1680, forecast: 1680, confidenceLower: 1590, confidenceUpper: 1770, driverNotes: 'Monsoon discounts' },
    { month: 'Jul 2026', dateStr: '2026-07', historical: 1590, forecast: 1590, confidenceLower: 1500, confidenceUpper: 1680, driverNotes: 'Low coastal demand' },
    { month: 'Aug 2026', dateStr: '2026-08', historical: 1640, forecast: 1640, confidenceLower: 1540, confidenceUpper: 1740, driverNotes: 'Rebound begins' },
    { month: 'Sep 2026', dateStr: '2026-09', forecast: 1760, confidenceLower: 1650, confidenceUpper: 1870, driverNotes: 'Current Month: Strong Paradip/Vizag fixtures' },
    { month: 'Oct 2026', dateStr: '2026-10', forecast: 1910, confidenceLower: 1770, confidenceUpper: 2050, driverNotes: '30-Day: Panamax charter rates rising by $1,400/day' },
    { month: 'Nov 2026', dateStr: '2026-11', forecast: 2040, confidenceLower: 1880, confidenceUpper: 2200, driverNotes: '60-Day: Peak Australian & Indonesian coal flow' },
    { month: 'Dec 2026', dateStr: '2026-12', forecast: 2120, confidenceLower: 1930, confidenceUpper: 2310, driverNotes: '90-Day: Q4 high fixture momentum' },
    { month: 'Jan 2027', dateStr: '2027-01', forecast: 1690, confidenceLower: 1500, confidenceUpper: 1880, driverNotes: '120-Day: Seasonal normalization' },
    { month: 'Feb 2027', dateStr: '2027-02', forecast: 1460, confidenceLower: 1280, confidenceUpper: 1640, driverNotes: '150-Day: Favorable spot fixture rates' },
    { month: 'Mar 2027', dateStr: '2027-03', forecast: 1680, confidenceLower: 1450, confidenceUpper: 1910, driverNotes: '180-Day: Spring agricultural and mineral pickup' }
  ],
  BSI: [
    // Supramax Index
    { month: 'Oct 2025', dateStr: '2025-10', historical: 1390, forecast: 1390, confidenceLower: 1340, confidenceUpper: 1440, driverNotes: 'Indonesian geared coal brisk' },
    { month: 'Nov 2025', dateStr: '2025-11', historical: 1480, forecast: 1480, confidenceLower: 1420, confidenceUpper: 1540, driverNotes: 'Indian Ocean trade strong' },
    { month: 'Dec 2025', dateStr: '2025-12', historical: 1560, forecast: 1560, confidenceLower: 1490, confidenceUpper: 1630, driverNotes: 'Firm Pacific rates' },
    { month: 'Jan 2026', dateStr: '2026-01', historical: 1320, forecast: 1320, confidenceLower: 1260, confidenceUpper: 1380, driverNotes: 'Seasonal drop' },
    { month: 'Feb 2026', dateStr: '2026-02', historical: 1190, forecast: 1190, confidenceLower: 1130, confidenceUpper: 1250, driverNotes: 'Annual low' },
    { month: 'Mar 2026', dateStr: '2026-03', historical: 1370, forecast: 1370, confidenceLower: 1300, confidenceUpper: 1440, driverNotes: 'SE Asian recovery' },
    { month: 'Apr 2026', dateStr: '2026-04', historical: 1490, forecast: 1490, confidenceLower: 1410, confidenceUpper: 1570, driverNotes: 'Strong Indonesian exports to Haldia/Paradip' },
    { month: 'May 2026', dateStr: '2026-05', historical: 1540, forecast: 1540, confidenceLower: 1450, confidenceUpper: 1630, driverNotes: 'Pre-monsoon import rush' },
    { month: 'Jun 2026', dateStr: '2026-06', historical: 1410, forecast: 1410, confidenceLower: 1320, confidenceUpper: 1500, driverNotes: 'Monsoon disruption at Haldia' },
    { month: 'Jul 2026', dateStr: '2026-07', historical: 1340, forecast: 1340, confidenceLower: 1250, confidenceUpper: 1430, driverNotes: 'Monsoon swell delays' },
    { month: 'Aug 2026', dateStr: '2026-08', historical: 1390, forecast: 1390, confidenceLower: 1290, confidenceUpper: 1490, driverNotes: 'Gradual increase' },
    { month: 'Sep 2026', dateStr: '2026-09', forecast: 1480, confidenceLower: 1380, confidenceUpper: 1580, driverNotes: 'Current Month: High Supramax demand for Haldia' },
    { month: 'Oct 2026', dateStr: '2026-10', forecast: 1590, confidenceLower: 1470, confidenceUpper: 1710, driverNotes: '30-Day: Geared bulker tightness in Malacca' },
    { month: 'Nov 2026', dateStr: '2026-11', forecast: 1680, confidenceLower: 1540, confidenceUpper: 1820, driverNotes: '60-Day: High Indonesian and Mozambican fixtures' },
    { month: 'Dec 2026', dateStr: '2026-12', forecast: 1740, confidenceLower: 1580, confidenceUpper: 1900, driverNotes: '90-Day: Q4 peak activity' },
    { month: 'Jan 2027', dateStr: '2027-01', forecast: 1420, confidenceLower: 1260, confidenceUpper: 1580, driverNotes: '120-Day: Post-holiday pullback' },
    { month: 'Feb 2027', dateStr: '2027-02', forecast: 1240, confidenceLower: 1080, confidenceUpper: 1400, driverNotes: '150-Day: Best period charter entry window' },
    { month: 'Mar 2027', dateStr: '2027-03', forecast: 1410, confidenceLower: 1210, confidenceUpper: 1610, driverNotes: '180-Day: Broad-based recovery' }
  ]
};

export const MARKET_TIMING_SIGNALS: MarketTimingSignal[] = [
  {
    id: 'sig-1',
    signalType: 'STRONG_BUY_COA',
    badgeColor: 'emerald',
    title: 'Lock 6-Month COA: Australia -> Paradip/Dhamra (Capesize)',
    recommendedAction: 'Execute 6-month Contract of Affreightment (COA) within next 10-14 days. Baltic Capesize Index forecasted to increase +24% by Q4 2026.',
    optimalBookingWindow: 'Target Laycan Window: 15 Sep - 05 Oct 2026',
    expectedCostImpact: 'Projected Net Savings: $2.10 - $2.70 / Metric Ton (~$380,000 per voyage vs forecasted Spot peak).',
    tradeRoutesAffected: ['Australia (Hay Point/Gladstone) -> Paradip / Dhamra / Gangavaram'],
    keyDriver: 'China infrastructure stimulus + Australian dry season output acceleration tightening Capesize tonnage.',
    confidenceScore: 92
  },
  {
    id: 'sig-2',
    signalType: 'LOCK_MEDIUM_TERM',
    badgeColor: 'blue',
    title: 'Fix 3-6 Month Multiple Voyage: Indonesia -> Haldia (Supramax/Ultramax)',
    recommendedAction: 'Transition from single spot voyages to a 6-voyage quarterly package. Avoid high demurrage exposure during monsoon cessation.',
    optimalBookingWindow: 'Immediate Execution: Within 7 Days',
    expectedCostImpact: 'Saves $1.40 / MT on bunker clause hedge and reduces waiting demurrage at Sandheads/Haldia.',
    tradeRoutesAffected: ['Indonesia (Taboneo/Samarinda) -> Haldia / Paradip'],
    keyDriver: 'Indonesian export quota rush prior to year-end monsoon rains causing prompt tonnage shortage.',
    confidenceScore: 88
  },
  {
    id: 'sig-3',
    signalType: 'ACCUMULATE_SPOT',
    badgeColor: 'amber',
    title: 'Short-Term Spot Window: US East Coast -> Gangavaram/Vizag (Panamax)',
    recommendedAction: 'Charter prompt spot tonnage for October laycan before transatlantic rates spike in November.',
    optimalBookingWindow: 'Booking Window: 20 Sep - 30 Sep 2026',
    expectedCostImpact: 'Secures benchmark freight of $32.80/MT before expected rise to $36.00/MT in Q4.',
    tradeRoutesAffected: ['US (Norfolk/Baltimore) -> Gangavaram / Vizag'],
    keyDriver: 'US coal export terminal backlogs clearing before winter river ice conditions.',
    confidenceScore: 84
  },
  {
    id: 'sig-4',
    signalType: 'WAIT_RATE_DIP',
    badgeColor: 'orange',
    title: 'Hold 12-Month Period Charters until Q1 2027 Seasonal Trough',
    recommendedAction: 'Do not lock full-year 12-month fixed period contracts at current Q4 elevated valuations. Wait for the February cyclical low.',
    optimalBookingWindow: 'Target Execution: Late January - Mid February 2027',
    expectedCostImpact: 'Avoids overpaying $2,200 - $3,500/day on 1-year Time Charter equivalent rates.',
    tradeRoutesAffected: ['Global Dry Bulk Fleet (Capesize / Panamax / Supramax)'],
    keyDriver: 'Annual post-Chinese New Year fleet oversupply consistently creates lowest rate benchmark of the calendar year.',
    confidenceScore: 95
  }
];

export const LIVE_MARKET_TICKER = [
  { symbol: 'BDI', name: 'Baltic Dry Index', value: 1880, change: '+45 pts', changePercent: '+2.45%', trend: 'up' },
  { symbol: 'BCI', name: 'Baltic Capesize', value: 2720, change: '+118 pts', changePercent: '+4.53%', trend: 'up' },
  { symbol: 'BPI', name: 'Baltic Panamax', value: 1760, change: '+22 pts', changePercent: '+1.26%', trend: 'up' },
  { symbol: 'BSI', name: 'Baltic Supramax', value: 1480, change: '+14 pts', changePercent: '+0.95%', trend: 'up' },
  { symbol: 'VLSFO-SIN', name: 'VLSFO Bunker (Singapore)', value: '$582.50/t', change: '-$4.50', changePercent: '-0.77%', trend: 'down' },
  { symbol: 'VLSFO-FUJ', name: 'VLSFO Bunker (Fujairah)', value: '$576.00/t', change: '-$3.00', changePercent: '-0.52%', trend: 'down' },
  { symbol: 'COAL-HCC', name: 'Prem Coking Coal (FOB Aus)', value: '$224.50/t', change: '+$2.00', changePercent: '+0.90%', trend: 'up' },
  { symbol: 'COAL-ID', name: 'Indo Thermal Coal (4200 GAR)', value: '$52.80/t', change: '+$0.60', changePercent: '+1.15%', trend: 'up' }
];

export const MACRO_SCENARIOS_DATA = [
  {
    id: 'china-shock',
    name: 'China Steel Production & Demand Surge',
    description: 'Surge in Chinese iron ore & met coal imports tightening global Capesize & Panamax availability.',
    capesizeImpactPercent: +24.0,
    panamaxImpactPercent: +14.0,
    supramaxImpactPercent: +8.0,
    bunkerPriceMultiplier: 1.05,
    congestionDaysDelta: +1.5,
    active: false
  },
  {
    id: 'monsoon-lull',
    name: 'Bay of Bengal Monsoon Disruption',
    description: 'Heavy seasonal monsoons reducing Indian domestic cement demand and slowing port discharge at Haldia/Paradip.',
    capesizeImpactPercent: -14.0,
    panamaxImpactPercent: -10.0,
    supramaxImpactPercent: -8.0,
    bunkerPriceMultiplier: 0.96,
    congestionDaysDelta: +2.5,
    active: false
  },
  {
    id: 'bunker-spike',
    name: 'Geopolitical Bunker Fuel Spike (+25% VLSFO)',
    description: 'Crude supply disruptions raising VLSFO from $580/MT to $725/MT.',
    capesizeImpactPercent: +18.0,
    panamaxImpactPercent: +16.0,
    supramaxImpactPercent: +14.0,
    bunkerPriceMultiplier: 1.25,
    congestionDaysDelta: 0.0,
    active: false
  },
  {
    id: 'canal-bottleneck',
    name: 'Maritime Chokepoint Rerouting (Cape Surcharge)',
    description: 'Transit disruptions forcing Cape of Good Hope rerouting and increasing global ton-mile demand.',
    capesizeImpactPercent: +20.0,
    panamaxImpactPercent: +18.0,
    supramaxImpactPercent: +12.0,
    bunkerPriceMultiplier: 1.10,
    congestionDaysDelta: +1.0,
    active: false
  }
];

