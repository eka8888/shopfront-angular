import { CentPrecisionMoney } from '../models/cart.interface';

export function moneyToAmount(money: CentPrecisionMoney | undefined): number {
  if (!money) {
    return 0;
  }

  return money.centAmount / Math.pow(10, money.fractionDigits);
}

export function localizedName(name: Record<string, string>, locale = 'en'): string {
  return name[locale] ?? Object.values(name)[0] ?? '';
}
