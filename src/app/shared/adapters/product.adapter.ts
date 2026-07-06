import { CtProduct, Product } from '../interfaces/product.interface';

export function adaptCtToProduct(ctProduct: CtProduct): Product {
  const variant = ctProduct.masterVariant;

  const price = variant.prices?.[0].value.centAmount ?? 0;
  const description = ctProduct.description?.['en-US'] ?? '';
  const imageUrl = (variant.images?.[0]?.url) ?? '';
  const detailedImageUrl = (variant.images?.[1]?.url) ?? '';

  return {
    id: ctProduct.key,
    name: ctProduct.name['en-US'],
    price: price / 100,
    description,
    categoryId: 0, // TODO: change later
    isNew: false, // TODO: change later
    image: imageUrl,
    detailedImage: detailedImageUrl,
  };
}
