import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { CartPage } from './cart-page';
import { CartService } from '../../../../shared/services/cart.service';
import { CartItem } from '../../../../shared/interfaces/cart-item.interface';
import { ClearCartModal } from '../../components/clear-cart-modal/clear-cart-modal';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call CartService.clearCart() when the clear cart modal is confirmed', () => {
    const cartService = TestBed.inject(CartService);
    const clearCartSpy = vi.spyOn(cartService, 'clearCart');

    component.clearCartModalVisible.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.directive(ClearCartModal));
    modal.componentInstance.confirmed.emit();

    expect(clearCartSpy).toHaveBeenCalledTimes(1);
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

    const item = { id: 1, name: 'Test item', price: 40, quantity: 3 } as CartItem;

    expect(component.discountedSubtotal(item)).toBe(60);
  });

  it('should show the original (crossed-out) and discounted price per item when a promo code is applied', () => {
    const cartService = TestBed.inject(CartService);
    cartService.cartItems.set([{ id: 1, name: 'Test item', price: 100, quantity: 1 } as CartItem]);
    cartService.discount.set(10);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.line-through')?.textContent).toContain('$100');
    expect(compiled.textContent).toContain('$90');
  });

  it('should show a single price per item when no promo code is applied', () => {
    const cartService = TestBed.inject(CartService);
    cartService.cartItems.set([{ id: 1, name: 'Test item', price: 100, quantity: 1 } as CartItem]);
    cartService.discount.set(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.line-through')).toBeNull();
  });
});
