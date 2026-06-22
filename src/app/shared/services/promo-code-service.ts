import { Injectable, signal } from '@angular/core';
import promoCodes from '../data/promoCode.json';

@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  promoCode = signal(promoCodes);

  getPromoCode() {
    return this.promoCode();
  }
}
