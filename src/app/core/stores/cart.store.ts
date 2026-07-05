import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Cart } from '../models/cart.interface';
import { moneyToAmount } from '../utils/money';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    lineItems: computed(() => store.cart()?.lineItems ?? []),

    itemsCount: computed(() =>
      (store.cart()?.lineItems ?? []).reduce((sum, item) => sum + item.quantity, 0),
    ),

    total: computed(() => moneyToAmount(store.cart()?.totalPrice)),

    currencyCode: computed(() => store.cart()?.totalPrice.currencyCode ?? 'USD'),

    isEmpty: computed(() => (store.cart()?.lineItems.length ?? 0) === 0),
  })),

  withMethods((store) => ({
    setCart(cart: Cart): void {
      patchState(store, { cart });
    },

    clearCart(): void {
      patchState(store, { cart: null });
    },

    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  })),
);
