import { CurrencyType } from '../types/maritime';

export const USD_TO_INR_RATE = 86.50; // 1 USD = 86.50 INR

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatINR(amountUSD: number): string {
  const inrAmount = amountUSD * USD_TO_INR_RATE;
  if (Math.abs(inrAmount) >= 10000000) {
    return `₹${(inrAmount / 10000000).toFixed(2)} Cr`;
  } else if (Math.abs(inrAmount) >= 100000) {
    return `₹${(inrAmount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${inrAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatCurrency(amountUSD: number, currency: CurrencyType = 'USD'): string {
  if (currency === 'INR') {
    return formatINR(amountUSD);
  }
  return formatUSD(amountUSD);
}

export function formatRatePerMT(usdPerMT: number, currency: CurrencyType = 'USD'): string {
  if (currency === 'INR') {
    return `₹${Math.round(usdPerMT * USD_TO_INR_RATE).toLocaleString('en-IN')}/MT`;
  }
  return `$${usdPerMT.toFixed(2)}/MT`;
}
