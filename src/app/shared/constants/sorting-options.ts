import { Sorting } from '../types/sorting.enums';

export const sortingOptions: { value: Sorting; label: string }[] = [
  { value: Sorting.NameAsc, label: 'Name ↑' },
  { value: Sorting.NameDesc, label: 'Name ↓' },
  { value: Sorting.PriceAsc, label: 'Price ↑' },
  { value: Sorting.PriceDesc, label: 'Price ↓' },
];
