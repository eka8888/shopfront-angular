import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CustomerProfile } from '../models/auth.interface';


interface AuthState {
  token: string | null;
  profile: CustomerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  profile: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.token()),
  })),

  withMethods((store) => ({
    setToken(token: string): void {
      localStorage.setItem('access_token', token);
      patchState(store, { token });
    },

    clearToken(): void {
      localStorage.removeItem('access_token');
      patchState(store, {
        token: null,
        profile: null,
      });
    },

    setProfile(profile: CustomerProfile): void {
      patchState(store, { profile });
    },

    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  }))
);
