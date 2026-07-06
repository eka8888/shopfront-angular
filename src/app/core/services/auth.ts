import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal} from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Token } from './token';
import { AuthStore } from '../stores/auth.store.store';
import { AddressFormValue, ChangePasswordRequest, CustomerProfile, CustomerResponse, LoginRequest, RegisterRequest, TokenResponse, UpdateProfileRequest } from '../models/auth.interface';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private tokenService = inject(Token);

  private loggedIn = signal(!!this.tokenService.getToken());
private authStore = inject(AuthStore);

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

login(data: LoginRequest): Observable<TokenResponse> {
  const body = new URLSearchParams();

  body.set('grant_type', 'password');
  body.set('username', data.email);
  body.set('password', data.password);

  this.authStore.setLoading(true);
  this.authStore.setError(null);

  return this.http
    .post<TokenResponse>(
      `${environment.authUrl}/oauth/${environment.projectKey}/customers/token`,
      body.toString(),
      { headers: this.getBasicAuthHeaders() }
    )
    .pipe(
      tap((response) => {
        this.tokenService.setToken(response.access_token);
        this.authStore.setToken(response.access_token);
        this.authStore.setLoading(false);
      })
    );
}


 
  
  register(data: RegisterRequest): Observable<CustomerResponse> {
  const shippingAddress = {
    country: this.mapCountryCode(data.country),
    city: data.city,
    streetName: data.street,
    postalCode: data.postalCode,
  };

  const billingAddress = {
    country: this.mapCountryCode(data.billingCountry ?? data.country),
    city: data.billingCity ?? data.city,
    streetName: data.billingStreet ?? data.street,
    postalCode: data.billingPostalCode ?? data.postalCode,
  };

  const useSameAddress = data.useSameAddressForBilling;

  const customerBody = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    addresses: useSameAddress
      ? [shippingAddress]
      : [shippingAddress, billingAddress],
    defaultShippingAddress: 0,
    defaultBillingAddress: useSameAddress ? 0 : 1,
  };

  return this.getProjectToken().pipe(
    switchMap((tokenResponse) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${tokenResponse.access_token}`,
      });

      return this.http.post<CustomerResponse>(
        `${environment.apiUrl}/${environment.projectKey}/customers`,
        customerBody,
        { headers }
      );
    })
  );
}

  getMyProfile(): Observable<CustomerProfile> {
  this.authStore.setLoading(true);
  this.authStore.setError(null);

  return this.http
    .get<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`
    )
    .pipe(
      tap((profile) => {
        this.authStore.setProfile(profile);
        this.authStore.setLoading(false);
      })
    );
}

  updateMyProfile(data: UpdateProfileRequest): Observable<CustomerProfile> {
    const body = {
      version: data.version,
      actions: [
        {
          action: 'setFirstName',
          firstName: data.firstName,
        },
        {
          action: 'setLastName',
          lastName: data.lastName,
        },
        {
          action: 'changeEmail',
          email: data.email,
        },
        {
          action: 'setDateOfBirth',
          dateOfBirth: data.dateOfBirth,
        },
      ],
    };

    return this.http.post<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`,
      body
    );
  }

  addAddress(
    version: number,
    address: AddressFormValue
  ): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`,
      {
        version,
        actions: [
          {
            action: 'addAddress',
            address: {
              streetName: address.streetName,
              city: address.city,
              country: this.mapCountryCode(address.country),
              postalCode: address.postalCode,
            },
          },
        ],
      }
    );
  }

  updateAddress(
    version: number,
    addressId: string,
    address: AddressFormValue
  ): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`,
      {
        version,
        actions: [
          {
            action: 'changeAddress',
            addressId,
            address: {
              streetName: address.streetName,
              city: address.city,
              country: this.mapCountryCode(address.country),
              postalCode: address.postalCode,
            },
          },
        ],
      }
    );
  }

  deleteAddress(
    version: number,
    addressId: string
  ): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`,
      {
        version,
        actions: [
          {
            action: 'removeAddress',
            addressId,
          },
        ],
      }
    );
  }

  setDefaultShippingAddress(
    version: number,
    addressId: string
  ): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`,
      {
        version,
        actions: [
          {
            action: 'setDefaultShippingAddress',
            addressId,
          },
        ],
      }
    );
  }

  setDefaultBillingAddress(
    version: number,
    addressId: string
  ): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>(
      `${environment.apiUrl}/${environment.projectKey}/me`,
      {
        version,
        actions: [
          {
            action: 'setDefaultBillingAddress',
            addressId,
          },
        ],
      }
    );
  }

  logout(): void {
  this.tokenService.clearToken();
  this.authStore.clearToken();
}

  private getProjectToken(): Observable<TokenResponse> {
    const body = new URLSearchParams();

    body.set('grant_type', 'client_credentials');

    return this.http.post<TokenResponse>(
      `${environment.authUrl}/oauth/token`,
      body.toString(),
      { headers: this.getBasicAuthHeaders() }
    );
  }

  private getBasicAuthHeaders(): HttpHeaders {
  const basicAuth = btoa(
    `${environment.clientId}:${environment.clientSecret}`
  );

  return new HttpHeaders({
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  });
}

  private mapCountryCode(country: string): string {
    const countries: Record<string, string> = {
      georgia: 'GE',
      usa: 'US',
      germany: 'DE',
    };

    return countries[country] ?? country.toUpperCase();
  }
  changePassword(data: ChangePasswordRequest): Observable<CustomerProfile> {
  return this.http.post<CustomerProfile>(
    `${environment.apiUrl}/${environment.projectKey}/me/password`,
    {
      version: data.version,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }
  );
}
}