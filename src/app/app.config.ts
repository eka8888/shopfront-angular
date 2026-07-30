import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  catchError,
  of,
} from 'rxjs';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config.token';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { PublicTokenService } from './core/services/public-token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
      ])
    ),


    provideAppInitializer(() => {
      const publicTokenService = inject(
        PublicTokenService
      );

      return publicTokenService
        .ensurePublicToken()
        .pipe(
          catchError(() => of(null))
        );
    }),

    {
      provide: APP_CONFIG,
      useValue: {
        appName: 'ShopFront',
        minPasswordLength: 8,
      },
    },
  ],
};