import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Catalog } from './catalog';
import { CartApi } from '../../../../core/services/cart-api';
import { Product } from '../../../../shared/interfaces/product.interface';

describe('Catalog', () => {
  let component: Catalog;
  let fixture: ComponentFixture<Catalog>;

  const cartApiMock = {
    addLineItem: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CartApi, useValue: cartApiMock }],
      imports: [Catalog],
    }).compileComponents();

    fixture = TestBed.createComponent(Catalog);
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
