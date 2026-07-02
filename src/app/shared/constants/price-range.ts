export const PRICE_RANGE_MAP: Record<string, { min: number; max?: number }> = {
  '0': { min: 0, max: 10 },
  '10': { min: 10, max: 50 },
  '50': { min: 50, max: 100 },
  '100': { min: 100, max: 200 },
  '200': { min: 200 },
};

export const PRICE_RANGES = Object.values(PRICE_RANGE_MAP);
