import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no discount applied', () => {
    expect(service.discount()).toBe(0);
    expect(service.isDiscountApplied()).toBe(false);
  });

  it('applyDiscount() should set a valid percentage', () => {
    service.applyDiscount(20);

    expect(service.discount()).toBe(20);
    expect(service.isDiscountApplied()).toBe(true);
  });

  it('applyDiscount() should reject an out-of-range percentage', () => {
    service.applyDiscount(150);

    expect(service.discount()).toBe(0);
  });

  it('resetDiscount() should clear the discount', () => {
    service.applyDiscount(20);
    service.resetDiscount();

    expect(service.discount()).toBe(0);
    expect(service.isDiscountApplied()).toBe(false);
  });
});
