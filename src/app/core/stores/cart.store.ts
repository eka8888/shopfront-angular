import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Cart } from '../models/cart.interface';
import { moneyToAmount } from '../utils/money';

interface CartState {
  cart: Cart | null;
  error: string | null;
  pendingRequests: number;
  pendingLineItemIds: string[];
}

const initialState: CartState = {
  cart: null,
  error: null,
  pendingRequests: 0,
  pendingLineItemIds: [],
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

    loading: computed(() => store.pendingRequests() > 0),
  })),

  withMethods((store) => ({
    setCart(cart: Cart): void {
      patchState(store, { cart });
    },

    clearCart(): void {
      patchState(store, { cart: null });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },

    beginRequest(): void {
      patchState(store, { pendingRequests: store.pendingRequests() + 1 });
    },

    endRequest(): void {
      patchState(store, { pendingRequests: Math.max(0, store.pendingRequests() - 1) });
    },

    beginLineItemUpdate(lineItemId: string): void {
      patchState(store, {
        pendingLineItemIds: [...store.pendingLineItemIds(), lineItemId],
      });
    },

    endLineItemUpdate(lineItemId: string): void {
      patchState(store, {
        pendingLineItemIds: store.pendingLineItemIds().filter((id) => id !== lineItemId),
      });
    },

    isLineItemUpdating(lineItemId: string): boolean {
      return store.pendingLineItemIds().includes(lineItemId);
    },
  })),
);
