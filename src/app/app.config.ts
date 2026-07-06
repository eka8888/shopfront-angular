import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config.token';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_CONFIG,
      useValue: {
        appName: 'ShopFront',
        minPasswordLength: 8,
      },
    },
  ],
};