import { CtProduct, Product } from '../interfaces/product.interface';

export function adaptCtToProduct(ctProduct: CtProduct): Product {
  // console.log(ctProduct);

  const price = ctProduct.masterVariant.prices?.[0].value.centAmount ?? 0;
  const description = ctProduct.description?.['en-US'] ?? '';
  const imageUrl = (ctProduct.masterVariant.images?.[0]?.url) ?? '';

  return {
    id: ctProduct.key,
    name: ctProduct.name['en-US'],
    price: price / 100,
    description,
    categoryId: 0, // TODO: change later
    isNew: false, // TODO: change later
    image: imageUrl,
  };
}
