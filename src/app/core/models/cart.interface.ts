export interface CentPrecisionMoney {
  type: 'centPrecision';
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export type LocalizedString = Record<string, string>;

export interface LineItemImage {
  url: string;
  label?: string;
}

export interface LineItem {
  id: string;
  productId: string;
  name: LocalizedString;
  quantity: number;
  price: {
    value: CentPrecisionMoney;
  };
  totalPrice: CentPrecisionMoney;
  variant: {
    images?: LineItemImage[];
  };
}

export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
  totalPrice: CentPrecisionMoney;
  customerId?: string;
  anonymousId?: string;
}

export type CartUpdateAction =
  | { action: 'addLineItem'; productId: string; variantId: number; quantity: number }
  | { action: 'addLineItem'; sku: string; quantity: number }
  | { action: 'changeLineItemQuantity'; lineItemId: string; quantity: number }
  | { action: 'removeLineItem'; lineItemId: string };

export interface CartUpdatePayload {
  version: number;
  actions: CartUpdateAction[];
}

export interface CreateCartPayload {
  currency: string;
}
