import { InjectionToken } from '@angular/core';

export interface AppConfig {
  appName: string;
  minPasswordLength: number;
}

export const APP_CONFIG =
  new InjectionToken<AppConfig>('APP_CONFIG');