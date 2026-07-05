import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CartPage } from './cart-page';
import { CartService } from '../../../../shared/services/cart.service';
import { CartApi } from '../../../../core/services/cart-api';
import { CartStore } from '../../../../core/stores/cart.store';
import { Cart, LineItem } from '../../../../core/models/cart.interface';
import { ClearCartModal } from '../../components/clear-cart-modal/clear-cart-modal';

function makeLineItem(overrides: Partial<LineItem> = {}): LineItem {
  return {
    id: 'line-item-1',
    productId: 'product-1',
    name: { en: 'Test item' },
    quantity: 1,
    price: {
      value: { type: 'centPrecision', currencyCode: 'USD', centAmount: 10000, fractionDigits: 2 },
    },
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 10000,
      fractionDigits: 2,
    },
    variant: {},
    ...overrides,
  };
}

function makeCart(lineItems: LineItem[]): Cart {
  const centAmount = lineItems.reduce((sum, item) => sum + item.totalPrice.centAmount, 0);

  return {
    id: 'cart-1',
    version: 1,
    lineItems,
    totalPrice: { type: 'centPrecision', currencyCode: 'USD', centAmount, fractionDigits: 2 },
  };
}

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let cartStore: InstanceType<typeof CartStore>;

  const cartApiMock = {
    loadActiveCart: vi.fn(() => of(makeCart([]))),
    changeLineItemQuantity: vi.fn(() => of(makeCart([]))),
    removeLineItem: vi.fn(() => of(makeCart([]))),
    clearCart: vi.fn(() => of(makeCart([]))),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    cartApiMock.loadActiveCart.mockReturnValue(of(makeCart([])));
    cartApiMock.clearCart.mockReturnValue(of(makeCart([])));

    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [provideRouter([]), { provide: CartApi, useValue: cartApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the active cart on init', () => {
    expect(cartApiMock.loadActiveCart).toHaveBeenCalledTimes(1);
  });

  it('should call CartApi.clearCart() when the clear cart modal is confirmed', () => {
    component.clearCartModalVisible.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.directive(ClearCartModal));
    modal.componentInstance.confirmed.emit();

    expect(cartApiMock.clearCart).toHaveBeenCalledTimes(1);
  });

  it('should hide the clear cart modal after confirming', () => {
    component.clearCartModalVisible.set(true);
    fixture.detectChanges();

    component.onClearCart();

    expect(component.clearCartModalVisible()).toBe(false);
  });

  it('discountedPrice() should return the original price when no discount is applied', () => {
    const cartService = TestBed.inject(CartService);
    cartService.discount.set(0);

    expect(component.discountedPrice(100)).toBe(100);
  });

  it('discountedPrice() should apply the discount percentage', () => {
    const cartService = TestBed.inject(CartService);
    cartService.discount.set(20);

    expect(component.discountedPrice(100)).toBe(80);
  });

  it('discountedSubtotal() should multiply the discounted price by quantity', () => {
    const cartService = TestBed.inject(CartService);
    cartService.discount.set(50);

    const item = makeLineItem({
      quantity: 3,
      price: {
        value: { type: 'centPrecision', currencyCode: 'USD', centAmount: 4000, fractionDigits: 2 },
      },
    });

    expect(component.discountedSubtotal(item)).toBe(60);
  });

  it('should show the original (crossed-out) and discounted price per item when a promo code is applied', () => {
    const cartService = TestBed.inject(CartService);
    cartStore.setCart(makeCart([makeLineItem()]));
    cartService.discount.set(10);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.line-through')?.textContent).toContain('$100');
    expect(compiled.textContent).toContain('$90');
  });

  it('should show a single price per item when no promo code is applied', () => {
    const cartService = TestBed.inject(CartService);
    cartStore.setCart(makeCart([makeLineItem()]));
    cartService.discount.set(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.line-through')).toBeNull();
  });
});
