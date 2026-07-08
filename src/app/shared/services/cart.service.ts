import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  discount = signal<number>(0);
  isDiscountApplied = computed(() => this.discount() > 0);

  constructor() {
    const savedDiscount = localStorage.getItem('savedDiscount');

    if (savedDiscount) {
      this.discount.set(JSON.parse(savedDiscount));
    }

    effect(() => {
      const discountToSave = this.discount();

      localStorage.setItem('savedDiscount', JSON.stringify(discountToSave));
    });
  }

  applyDiscount(percent: number) {
    if (percent >= 1 && percent <= 100) {
      this.discount.set(percent);
    } else {
      console.error('Invalid discount');
      return;
    }
  }

  resetDiscount() {
    this.discount.set(0);
  }
}
