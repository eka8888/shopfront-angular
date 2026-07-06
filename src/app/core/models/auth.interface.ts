
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  refresh_token?: string;
}

export interface RegisterRequest {
 email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;

  country: string;
  street: string;
  city: string;
  postalCode: string;

  useSameAddressForBilling: boolean;

  billingCountry?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
}

export interface CustomerAddress {
  id?: string;
  streetName?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface CustomerProfile {
  id: string;
  version: number;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  addresses?: CustomerAddress[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
}

export interface CustomerResponse {
  customer: CustomerProfile;
}

export interface UpdateProfileRequest {
  version: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface AddressFormValue {
  streetName: string;
  city: string;
  country: string;
  postalCode: string;
}
export interface ChangePasswordRequest {
  version: number;
  currentPassword: string;
  newPassword: string;
}