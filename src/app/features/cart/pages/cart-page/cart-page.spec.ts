import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { CartPage } from './cart-page';
import { CartService } from '../../../../shared/services/cart.service';
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
});
