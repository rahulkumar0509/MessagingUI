import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import {
  MSAL_INSTANCE,
  MsalService
} from '@azure/msal-angular';
// client ID/Application ID: f40d781f-595b-4389-abe6-d7a42432199e
// Tenant Id/Directory: 7a96d0ac-ddc2-4494-982d-06aae93bdb0f
export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: '0a8bf525-4df8-423a-9862-a692b11ee1ff',
      authority:
        'https://login.microsoftonline.com/7a96d0ac-ddc2-4494-982d-06aae93bdb0f',
      redirectUri: 'http://localhost:4200',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    }
  });
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory
    },
    MsalService
  ]
};
