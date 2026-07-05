import { TestBed } from '@angular/core/testing';

import { CartStore } from './cart.store';
import { Cart } from '../models/cart.interface';

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  const mockCart: Cart = {
    id: 'cart-1',
    version: 1,
    lineItems: [
      {
        id: 'line-item-1',
        productId: 'product-1',
        name: { en: 'Test Product' },
        quantity: 3,
        price: {
          value: { type: 'centPrecision', currencyCode: 'EUR', centAmount: 1000, fractionDigits: 2 },
        },
        totalPrice: { type: 'centPrecision', currencyCode: 'EUR', centAmount: 3000, fractionDigits: 2 },
        variant: {},
      },
    ],
    totalPrice: { type: 'centPrecision', currencyCode: 'EUR', centAmount: 3000, fractionDigits: 2 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CartStore);
  });

  it('should start with an empty cart', () => {
    expect(store.cart()).toBeNull();
    expect(store.lineItems()).toEqual([]);
    expect(store.isEmpty()).toBe(true);
  });

  it('should expose line items and computed totals after setCart()', () => {
    store.setCart(mockCart);

    expect(store.lineItems()).toEqual(mockCart.lineItems);
    expect(store.itemsCount()).toBe(3);
    expect(store.total()).toBe(30);
    expect(store.currencyCode()).toBe('EUR');
    expect(store.isEmpty()).toBe(false);
  });

  it('should reset to an empty cart on clearCart()', () => {
    store.setCart(mockCart);
    store.clearCart();

    expect(store.cart()).toBeNull();
    expect(store.isEmpty()).toBe(true);
  });

  it('should toggle loading and error state', () => {
    store.setLoading(true);
    expect(store.loading()).toBe(true);

    store.setError('Something went wrong');
    expect(store.error()).toBe('Something went wrong');
  });
});
