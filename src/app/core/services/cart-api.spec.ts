import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';

import { CartApi } from './cart-api';
import { CartStore } from '../stores/cart.store';
import { environment } from '../../../environments/environment';
import { Cart } from '../models/cart.interface';

describe('CartApi', () => {
  let service: CartApi;
  let httpMock: HttpTestingController;

  const cartStoreMock = {
    cart: vi.fn(),
    setCart: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
  };

  const mockCart: Cart = {
    id: 'cart-1',
    version: 1,
    lineItems: [
      {
        id: 'line-item-1',
        productId: 'product-1',
        name: { en: 'Test Product' },
        quantity: 2,
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
          centAmount: 2000,
          fractionDigits: 2,
        },
        variant: { images: [{ url: 'image.jpg' }] },
      },
    ],
    totalPrice: { type: 'centPrecision', currencyCode: 'EUR', centAmount: 2000, fractionDigits: 2 },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        CartApi,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartStore, useValue: cartStoreMock },
      ],
    });

    service = TestBed.inject(CartApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the active cart and store it', () => {
    service.loadActiveCart().subscribe((cart) => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/active-cart`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);

    expect(cartStoreMock.setCart).toHaveBeenCalledWith(mockCart);
    expect(cartStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  it('should create a new cart when no active cart exists (404)', () => {
    service.loadActiveCart().subscribe((cart) => {
      expect(cart).toEqual(mockCart);
    });

    const activeCartReq = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/active-cart`,
    );
    activeCartReq.flush('Not found', { status: 404, statusText: 'Not Found' });

    const createCartReq = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts`,
    );
    expect(createCartReq.request.method).toBe('POST');
    createCartReq.flush(mockCart);

    expect(cartStoreMock.setCart).toHaveBeenCalledWith(mockCart);
  });

  it('should send a changeLineItemQuantity update action', () => {
    cartStoreMock.cart.mockReturnValue(mockCart);

    service.changeLineItemQuantity('line-item-1', 5).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      version: mockCart.version,
      actions: [{ action: 'changeLineItemQuantity', lineItemId: 'line-item-1', quantity: 5 }],
    });
    req.flush(mockCart);
  });

  it('should send a removeLineItem update action', () => {
    cartStoreMock.cart.mockReturnValue(mockCart);

    service.removeLineItem('line-item-1').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    expect(req.request.body).toEqual({
      version: mockCart.version,
      actions: [{ action: 'removeLineItem', lineItemId: 'line-item-1' }],
    });
    req.flush(mockCart);
  });

  it('should send one removeLineItem action per line item when clearing the cart', () => {
    cartStoreMock.cart.mockReturnValue(mockCart);

    service.clearCart().subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    expect(req.request.body).toEqual({
      version: mockCart.version,
      actions: [{ action: 'removeLineItem', lineItemId: 'line-item-1' }],
    });
    req.flush({ ...mockCart, lineItems: [] });
  });

  it('should error out when clearing an already-empty cart without making a request', () => {
    cartStoreMock.cart.mockReturnValue({ ...mockCart, lineItems: [] });

    service.clearCart().subscribe({
      error: (err: Error) => {
        expect(err.message).toBe('Cart is already empty.');
      },
    });

    httpMock.expectNone(`${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`);
  });

  it('should retry once after a 409 by refetching the cart version and resubmitting the same actions', () => {
    cartStoreMock.cart.mockReturnValue(mockCart);
    const updatedCart = { ...mockCart, version: 2, lineItems: [] };

    service.removeLineItem('line-item-1').subscribe((cart) => {
      expect(cart).toEqual(updatedCart);
    });

    const firstAttempt = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    expect(firstAttempt.request.body.version).toBe(1);
    firstAttempt.flush('Conflict', { status: 409, statusText: 'Conflict' });

    const refetch = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    expect(refetch.request.method).toBe('GET');
    refetch.flush({ ...mockCart, version: 2 });

    const retry = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    expect(retry.request.method).toBe('POST');
    expect(retry.request.body.version).toBe(2);
    retry.flush(updatedCart);

    expect(cartStoreMock.setCart).toHaveBeenCalledWith(updatedCart);
    expect(cartStoreMock.setError).not.toHaveBeenCalledWith(expect.any(String));
  });

  it('should give up and surface an error after the retry also conflicts', () => {
    cartStoreMock.cart.mockReturnValue(mockCart);

    service.removeLineItem('line-item-1').subscribe({
      error: () => {
        // expected
      },
    });

    const firstAttempt = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    firstAttempt.flush('Conflict', { status: 409, statusText: 'Conflict' });

    const refetch = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    refetch.flush({ ...mockCart, version: 2 });

    const retry = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me/carts/${mockCart.id}`,
    );
    retry.flush('Conflict', { status: 409, statusText: 'Conflict' });

    expect(cartStoreMock.setError).toHaveBeenCalledWith(
      "Your cart changed elsewhere and we couldn't sync it automatically. Please refresh the page.",
    );
  });
});
