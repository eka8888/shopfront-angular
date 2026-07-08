import { adaptCtToProduct } from './product.adapter';
import { CtProduct } from '../interfaces/product.interface';

function makeCtProduct(overrides: Partial<CtProduct> = {}): CtProduct {
  return {
    id: 'd1317872-76da-435d-990c-9e54cf37fa7f',
    key: 'porcelain-dinner-plate-6',
    masterVariant: {
      sku: 'SKU-006',
      prices: [{ value: { centAmount: 2500, currencyCode: 'USD' } }],
      images: [{ url: 'image-1.jpg' }, { url: 'image-2.jpg' }],
    },
    name: { 'en-US': 'Porcelain Dinner Plate' },
    description: { 'en-US': 'A lovely plate.' },
    createdAt: '2026-01-01T00:00:00.000Z',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('adaptCtToProduct', () => {
  it('should map the human-readable key to id, keeping the real UUID separately as ctId', () => {
    const product = adaptCtToProduct(makeCtProduct());

    expect(product.id).toBe('porcelain-dinner-plate-6');
    expect(product.ctId).toBe('d1317872-76da-435d-990c-9e54cf37fa7f');
  });

  it('should map the master variant sku', () => {
    const product = adaptCtToProduct(makeCtProduct());

    expect(product.sku).toBe('SKU-006');
  });

  it('should convert centAmount to a plain price', () => {
    const product = adaptCtToProduct(makeCtProduct());

    expect(product.price).toBe(25);
  });

  it('should default price to 0 when no prices are available', () => {
    const product = adaptCtToProduct(
      makeCtProduct({ masterVariant: { sku: 'SKU-999', prices: [] } }),
    );

    expect(product.price).toBe(0);
  });

  it('should map the first image as image and the second as detailedImage', () => {
    const product = adaptCtToProduct(makeCtProduct());

    expect(product.image).toBe('image-1.jpg');
    expect(product.detailedImage).toBe('image-2.jpg');
  });

  it('should default images to an empty string when none are available', () => {
    const product = adaptCtToProduct(
      makeCtProduct({ masterVariant: { sku: 'SKU-999', prices: [] } }),
    );

    expect(product.image).toBe('');
    expect(product.detailedImage).toBe('');
  });
});
