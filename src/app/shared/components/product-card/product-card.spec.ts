import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ProductCard } from './product-card';
import { Product } from '../../interfaces/product.interface';

function makeProduct(): Product {
  return {
    id: 'porcelain-dinner-plate-6',
    ctId: 'd1317872-76da-435d-990c-9e54cf37fa7f',
    sku: 'SKU-006',
    name: 'Porcelain Dinner Plate',
    price: 25,
    description: 'A lovely plate.',
    categoryId: 'category-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', makeProduct());
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the full product (including sku/ctId) when Add to Cart is clicked', () => {
    const addToCartSpy = vi.fn();
    component.addToCart.subscribe(addToCartSpy);

    const fakeEvent = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as Event;
    component.onAddToCart(fakeEvent);

    expect(addToCartSpy).toHaveBeenCalledWith(makeProduct());
  });

  it('should prevent default and stop propagation when Add to Cart is clicked', () => {
    const fakeEvent = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as Event;
    component.onAddToCart(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
  });
});
