import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config.token';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes),
      {provide: APP_CONFIG,
  useValue: {
    appName: 'ShopFront',
    minPasswordLength: 8,
  },
},
  ],
};
