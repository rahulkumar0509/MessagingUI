import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import {
  MSAL_INSTANCE,
  MsalService
} from '@azure/msal-angular';

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: 'fc530a19-8028-44b7-923a-d6c547712d02',
      authority:
        'https://login.microsoftonline.com/a4dd4c5f-fda6-4bde-8f21-cbc02d0bf15f',
      redirectUri: window.location.origin,
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
