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
          value: {
            type: 'centPrecision',
            currencyCode: 'EUR',
            centAmount: 1000,
            fractionDigits: 2,
          },
        },
        totalPrice: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 3000,
          fractionDigits: 2,
        },
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

  it('should set error state', () => {
    store.setError('Something went wrong');
    expect(store.error()).toBe('Something went wrong');
  });

  it('loading should be true while any request is pending, based on a counter', () => {
    expect(store.loading()).toBe(false);

    store.beginRequest();
    expect(store.loading()).toBe(true);

    store.beginRequest();
    expect(store.loading()).toBe(true);

    store.endRequest();
    expect(store.loading()).toBe(true);

    store.endRequest();
    expect(store.loading()).toBe(false);
  });

  it('endRequest() should not go below zero when called more often than beginRequest()', () => {
    store.endRequest();
    store.endRequest();

    expect(store.loading()).toBe(false);
  });

  it('should track which line items currently have an update in flight', () => {
    expect(store.isLineItemUpdating('line-item-1')).toBe(false);

    store.beginLineItemUpdate('line-item-1');
    expect(store.isLineItemUpdating('line-item-1')).toBe(true);
    expect(store.isLineItemUpdating('line-item-2')).toBe(false);

    store.endLineItemUpdate('line-item-1');
    expect(store.isLineItemUpdating('line-item-1')).toBe(false);
  });
});
