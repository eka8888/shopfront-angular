export enum Sorting {
  NameAsc = 'name-asc',
  NameDesc = 'name-desc',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
}

export const DEFAULT_SORTING = Sorting.NameAsc;

export function isSorting(value: string): value is Sorting {
  return Object.values(Sorting).includes(value as Sorting);
}
