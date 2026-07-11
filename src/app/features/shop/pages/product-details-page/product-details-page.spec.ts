import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProductDetailsPage } from './product-details-page';
import { ProductService } from '../../../../shared/services/product.service';
import { CartApi } from '../../../../core/services/cart-api';
import { CartStore } from '../../../../core/stores/cart.store';
import { Product } from '../../../../shared/interfaces/product.interface';
import { Cart, LineItem } from '../../../../core/models/cart.interface';

const PRODUCT_KEY = 'porcelain-dinner-plate-6';
const PRODUCT_CT_ID = 'd1317872-76da-435d-990c-9e54cf37fa7f';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: PRODUCT_KEY,
    ctId: PRODUCT_CT_ID,
    sku: 'SKU-006',
    name: 'Porcelain Dinner Plate',
    price: 25,
    description: 'A lovely plate.',
    categoryId: 'category-1',
    image: 'image.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeLineItem(overrides: Partial<LineItem> = {}): LineItem {
  return {
    id: 'line-item-1',
    productId: PRODUCT_CT_ID,
    name: { en: 'Porcelain Dinner Plate' },
    quantity: 2,
    price: {
      value: { type: 'centPrecision', currencyCode: 'USD', centAmount: 2500, fractionDigits: 2 },
    },
    totalPrice: { type: 'centPrecision', currencyCode: 'USD', centAmount: 5000, fractionDigits: 2 },
    variant: {},
    ...overrides,
  };
}

function makeCart(lineItems: LineItem[]): Cart {
  return {
    id: 'cart-1',
    version: 1,
    lineItems,
    totalPrice: { type: 'centPrecision', currencyCode: 'USD', centAmount: 0, fractionDigits: 2 },
  };
}

describe('ProductDetailsPage', () => {
  let component: ProductDetailsPage;
  let fixture: ComponentFixture<ProductDetailsPage>;
  let cartStore: InstanceType<typeof CartStore>;

  const productServiceMock = {
    getProductById: vi.fn(() => makeProduct()),
    getOldPrice: vi.fn(() => 45),
    fetchProductByKey: vi.fn(() => of(makeProduct())),
  };

  const cartApiMock = {
    addLineItem: vi.fn(() => of(makeCart([]))),
    removeLineItem: vi.fn(() => of(makeCart([]))),
    changeLineItemQuantity: vi.fn(() => of(makeCart([]))),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    productServiceMock.getProductById.mockReturnValue(makeProduct());

    await TestBed.configureTestingModule({
      imports: [ProductDetailsPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => PRODUCT_KEY } } },
        },
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartApi, useValue: cartApiMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsPage);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report a quantity of 0 when the product is not in the cart', () => {
    cartStore.setCart(makeCart([]));

    expect(component.currentQuantity()).toBe(0);
  });

  it('should report the matching line item quantity when the product is already in the cart', () => {
    cartStore.setCart(makeCart([makeLineItem({ quantity: 3 })]));

    expect(component.currentQuantity()).toBe(3);
  });

  it('onAddToCart() should call CartApi.addLineItem with the product sku', () => {
    component.onAddToCart();

    expect(cartApiMock.addLineItem).toHaveBeenCalledWith('SKU-006');
  });

  it('onRemoveFromCart() should call CartApi.removeLineItem with the matching line item id', () => {
    cartStore.setCart(makeCart([makeLineItem({ id: 'line-item-42' })]));

    component.onRemoveFromCart();

    expect(cartApiMock.removeLineItem).toHaveBeenCalledWith('line-item-42');
  });

  it('onRemoveFromCart() should do nothing when the product is not in the cart', () => {
    cartStore.setCart(makeCart([]));

    component.onRemoveFromCart();

    expect(cartApiMock.removeLineItem).not.toHaveBeenCalled();
  });

  it('onIncreaseQuantity() should call changeLineItemQuantity with quantity + 1', () => {
    cartStore.setCart(makeCart([makeLineItem({ id: 'line-item-1', quantity: 2 })]));

    component.onIncreaseQuantity();

    expect(cartApiMock.changeLineItemQuantity).toHaveBeenCalledWith('line-item-1', 3);
  });

  it('onDecreaseQuantity() should call changeLineItemQuantity with quantity - 1', () => {
    cartStore.setCart(makeCart([makeLineItem({ id: 'line-item-1', quantity: 2 })]));

    component.onDecreaseQuantity();

    expect(cartApiMock.changeLineItemQuantity).toHaveBeenCalledWith('line-item-1', 1);
  });

  it('onDecreaseQuantity() should do nothing when quantity is already 1', () => {
    cartStore.setCart(makeCart([makeLineItem({ id: 'line-item-1', quantity: 1 })]));

    component.onDecreaseQuantity();

    expect(cartApiMock.changeLineItemQuantity).not.toHaveBeenCalled();
  });
});
