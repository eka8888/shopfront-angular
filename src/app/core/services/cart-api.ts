import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cart, CartUpdateAction } from '../models/cart.interface';
import { CartStore } from '../stores/cart.store';
import { stripTrailingSlash } from '../utils/url';

/** How many times to retry an update after a 409 (version conflict) before giving up. */
const MAX_CONFLICT_RETRIES = 1;

@Injectable({
  providedIn: 'root',
})
export class CartApi {
  private http = inject(HttpClient);
  private cartStore = inject(CartStore);

  private readonly baseUrl = `${stripTrailingSlash(environment.apiUrl)}/${environment.projectKey}`;

  // Tracks an in-flight loadActiveCart() request so concurrent callers
  // (e.g. Header and CartPage both loading on init) share one HTTP call
  // instead of firing duplicate requests.
  private activeCartRequest$: Observable<Cart> | null = null;

  /**
   * Fetches the customer's active cart. commercetools returns a 404 when no
   * active cart exists yet, in which case a new (empty) cart is created.
   */
  loadActiveCart(): Observable<Cart> {
    if (this.activeCartRequest$) {
      return this.activeCartRequest$;
    }

    this.cartStore.setLoading(true);
    this.cartStore.setError(null);

    this.activeCartRequest$ = this.http.get<Cart>(`${this.baseUrl}/me/active-cart`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.createCart();
        }

        return throwError(() => error);
      }),
      tap((cart) => {
        this.cartStore.setCart(cart);
        this.cartStore.setLoading(false);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      finalize(() => {
        this.activeCartRequest$ = null;
      }),
      shareReplay(1),
    );

    return this.activeCartRequest$;
  }

  createCart(currency = 'USD'): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/me/carts`, {
      currency,
    });
  }

  /**
   * Adds a line item by SKU. If the cart hasn't been loaded into the store
   * yet (e.g. this is the very first API call in the session), it's loaded
   * — creating one if needed — before the item is added.
   *
   * commercetools automatically merges into an existing line item for the
   * same product variant, so callers don't need to check whether the
   * product is already in the cart first.
   */
  addLineItem(sku: string, quantity = 1): Observable<Cart> {
    const cart = this.cartStore.cart();

    if (!cart) {
      return this.loadActiveCart().pipe(
        switchMap((freshCart) =>
          this.updateCart(freshCart.id, freshCart.version, [
            { action: 'addLineItem', sku, quantity },
          ]),
        ),
      );
    }

    return this.updateCart(cart.id, cart.version, [{ action: 'addLineItem', sku, quantity }]);
  }

  changeLineItemQuantity(lineItemId: string, quantity: number): Observable<Cart> {
    const cart = this.cartStore.cart();

    if (!cart) {
      return throwError(() => new Error('No active cart to update.'));
    }

    return this.updateCart(cart.id, cart.version, [
      { action: 'changeLineItemQuantity', lineItemId, quantity },
    ]);
  }

  removeLineItem(lineItemId: string): Observable<Cart> {
    const cart = this.cartStore.cart();

    if (!cart) {
      return throwError(() => new Error('No active cart to update.'));
    }

    return this.updateCart(cart.id, cart.version, [{ action: 'removeLineItem', lineItemId }]);
  }

  clearCart(): Observable<Cart> {
    const cart = this.cartStore.cart();

    if (!cart || cart.lineItems.length === 0) {
      return throwError(() => new Error('Cart is already empty.'));
    }

    const actions: CartUpdateAction[] = cart.lineItems.map((item) => ({
      action: 'removeLineItem',
      lineItemId: item.id,
    }));

    return this.updateCart(cart.id, cart.version, actions);
  }

  private updateCart(
    cartId: string,
    version: number,
    actions: CartUpdateAction[],
    retriesLeft = MAX_CONFLICT_RETRIES,
  ): Observable<Cart> {
    this.cartStore.setLoading(true);
    this.cartStore.setError(null);

    return this.http
      .post<Cart>(`${this.baseUrl}/me/carts/${cartId}`, {
        version,
        actions,
      })
      .pipe(
        tap((cart) => {
          this.cartStore.setCart(cart);
          this.cartStore.setLoading(false);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409 && retriesLeft > 0) {
            // Someone else changed the cart since we last read its version.
            // Refetch the current version and retry the same actions once.
            return this.http.get<Cart>(`${this.baseUrl}/me/carts/${cartId}`).pipe(
              switchMap((freshCart) =>
                this.updateCart(cartId, freshCart.version, actions, retriesLeft - 1),
              ),
              catchError((refetchError: HttpErrorResponse) => this.handleError(refetchError)),
            );
          }

          return this.handleError(error);
        }),
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong with your cart. Please try again.';

    if (error.status === 0) {
      message = 'Network error. Please check your internet connection.';
    } else if (error.status === 409) {
      message =
        "Your cart changed elsewhere and we couldn't sync it automatically. Please refresh the page.";
    }

    this.cartStore.setError(message);
    this.cartStore.setLoading(false);

    return throwError(() => error);
  }
}
