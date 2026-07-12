import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { NewArrivalsSection } from './new-arrivals-section';
import { CartApi } from '../../../../core/services/cart-api';
import { Product } from '../../../../shared/interfaces/product.interface';

describe('NewArrivalsSection', () => {
  let component: NewArrivalsSection;
  let fixture: ComponentFixture<NewArrivalsSection>;

  const cartApiMock = {
    addLineItem: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [NewArrivalsSection],
      providers: [{ provide: CartApi, useValue: cartApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NewArrivalsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handleAddToCart() should call CartApi.addLineItem with the product sku', () => {
    const product = { sku: 'SKU-006' } as Product;

    component.handleAddToCart(product);

    expect(cartApiMock.addLineItem).toHaveBeenCalledWith('SKU-006');
  });
});
