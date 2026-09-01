import { VesselSpecification } from '../types/maritime';

export const VESSEL_CLASSES: VesselSpecification[] = [
  {
    type: 'Handysize',
    displayName: 'Handysize Bulker',
    minDwt: 28000,
    maxDwt: 40000,
    typicalDwt: 35000,
    typicalDraft: 10.2, // meters fully laden
    typicalLOA: 180, // meters
    typicalBeam: 28.5, // meters
    ladenSpeedKnots: 13.0,
    ballastSpeedKnots: 13.5,
    fuelConsumptionAtSeaTonsPerDay: 18.5,
    fuelConsumptionInPortTonsPerDay: 3.5,
    isGeared: true, // 4 x 30t cranes with grabs
    bestSuitedFor: 'Draft-restricted shallow ports like Haldia, secondary riverine channels, and smaller parcel deliveries.',
    dailyCharterRateSpotUSD: 13500,
    dailyCharterRate3MoCOAUSD: 12200,
    dailyCharterRate12MoCOAUSD: 11400
  },
  {
    type: 'Supramax',
    displayName: 'Supramax Bulker',
    minDwt: 50000,
    maxDwt: 58000,
    typicalDwt: 55000,
    typicalDraft: 12.8,
    typicalLOA: 190,
    typicalBeam: 32.26,
    ladenSpeedKnots: 13.5,
    ballastSpeedKnots: 14.0,
    fuelConsumptionAtSeaTonsPerDay: 24.0,
    fuelConsumptionInPortTonsPerDay: 4.5,
    isGeared: true, // 4 x 30-35t cranes + grabs
    bestSuitedFor: 'Indonesian anchorages (Taboneo/Samarinda), Mozambique ports (Maputo/Beira), and flexible discharge at Gopalpur/Paradip.',
    dailyCharterRateSpotUSD: 16800,
    dailyCharterRate3MoCOAUSD: 15200,
    dailyCharterRate12MoCOAUSD: 14100
  },
  {
    type: 'Ultramax',
    displayName: 'Ultramax Bulker',
    minDwt: 60000,
    maxDwt: 66000,
    typicalDwt: 63500,
    typicalDraft: 13.3,
    typicalLOA: 199.9,
    typicalBeam: 32.26,
    ladenSpeedKnots: 13.8,
    ballastSpeedKnots: 14.2,
    fuelConsumptionAtSeaTonsPerDay: 25.5,
    fuelConsumptionInPortTonsPerDay: 4.5,
    isGeared: true,
    bestSuitedFor: 'Modern eco-geared workhorse. Perfect balance of high intake, shallow draft, and self-discharge capability.',
    dailyCharterRateSpotUSD: 18200,
    dailyCharterRate3MoCOAUSD: 16400,
    dailyCharterRate12MoCOAUSD: 15100
  },
  {
    type: 'Panamax',
    displayName: 'Panamax Bulker',
    minDwt: 70000,
    maxDwt: 79000,
    typicalDwt: 75000,
    typicalDraft: 14.2,
    typicalLOA: 225.0,
    typicalBeam: 32.26,
    ladenSpeedKnots: 13.8,
    ballastSpeedKnots: 14.5,
    fuelConsumptionAtSeaTonsPerDay: 28.0,
    fuelConsumptionInPortTonsPerDay: 3.5,
    isGeared: false, // gearless
    bestSuitedFor: 'Paradip, Vizag Inner Harbour, Gopalpur, US Gulf / Norfolk, and Australian coal trades.',
    dailyCharterRateSpotUSD: 19800,
    dailyCharterRate3MoCOAUSD: 17800,
    dailyCharterRate12MoCOAUSD: 16200
  },
  {
    type: 'Kamsarmax',
    displayName: 'Kamsarmax Bulker',
    minDwt: 80000,
    maxDwt: 85000,
    typicalDwt: 82000,
    typicalDraft: 14.5,
    typicalLOA: 229.0,
    typicalBeam: 32.26,
    ladenSpeedKnots: 14.0,
    ballastSpeedKnots: 14.5,
    fuelConsumptionAtSeaTonsPerDay: 29.5,
    fuelConsumptionInPortTonsPerDay: 3.8,
    isGeared: false,
    bestSuitedFor: 'Maximum intake for Panamax beam restrictions. Dominant vessel for Australian and US coal imports to Paradip and Vizag.',
    dailyCharterRateSpotUSD: 21500,
    dailyCharterRate3MoCOAUSD: 19200,
    dailyCharterRate12MoCOAUSD: 17500
  },
  {
    type: 'Capesize',
    displayName: 'Capesize Bulker',
    minDwt: 160000,
    maxDwt: 210000,
    typicalDwt: 180000,
    typicalDraft: 18.2, // Deep draft requirement
    typicalLOA: 292.0,
    typicalBeam: 45.0,
    ladenSpeedKnots: 14.2,
    ballastSpeedKnots: 15.0,
    fuelConsumptionAtSeaTonsPerDay: 48.0,
    fuelConsumptionInPortTonsPerDay: 5.5,
    isGeared: false,
    bestSuitedFor: 'High-volume coking/thermal coal from Australia, US East Coast, and Russia to Dhamra, Gangavaram, and Vizag Outer Harbour.',
    dailyCharterRateSpotUSD: 28500,
    dailyCharterRate3MoCOAUSD: 24800,
    dailyCharterRate12MoCOAUSD: 22000
  }
];
