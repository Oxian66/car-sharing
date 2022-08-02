import * as dayjs from 'dayjs';

export enum Price {
  base = 1000,
  base5 = base * 0.95,
  base10 = base * 0.9,
  base18 = base * 0.85,
}
export const calculatePrice = (n: number): number => {
  return (
    Math.max(0, n - 17) * Price.base18 +
    Math.max(0, Math.min(n, 17) - 9) * Price.base10 +
    Math.max(0, Math.min(n, 9) - 4) * Price.base5 +
    Math.max(0, Math.min(n, 4)) * Price.base
  );
};

export function getPrice(start: Date, end: Date) {
  const period = dayjs(end).diff(dayjs(start), 'day') + 1;
  return calculatePrice(period);
}

export const calculatePercent = (n: number, daysInMonth: number): number => {
  return Math.round((n / daysInMonth) * 100 * 100) / 100;
};
