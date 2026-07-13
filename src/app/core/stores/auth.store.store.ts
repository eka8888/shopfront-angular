import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { CustomerProfile } from '../models/auth.interface';

interface AuthState {
  customerToken: string | null;
  profile: CustomerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  customerToken:
    localStorage.getItem(
      'customer_access_token'
    ),

  profile: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(
      () => !!store.customerToken()
    ),
  })),

  withMethods((store) => ({
    setCustomerToken(
      customerToken: string
    ): void {
      patchState(store, {
        customerToken,
        error: null,
      });
    },

    clearCustomerToken(): void {
      patchState(store, {
        customerToken: null,
        profile: null,
        loading: false,
        error: null,
      });
    },

    setProfile(
      profile: CustomerProfile
    ): void {
      patchState(store, { profile });
    },

    clearProfile(): void {
      patchState(store, {
        profile: null,
      });
    },

    setLoading(
      loading: boolean
    ): void {
      patchState(store, { loading });
    },

    setError(
      error: string | null
    ): void {
      patchState(store, { error });
    },
  }))
);