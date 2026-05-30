import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';

// Paste your actual IDs here
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'fc530a19-8028-44b7-923a-d6c547712d02', 
    authority: 'https://login.microsoftonline.com/a4dd4c5f-fda6-4bde-8f21-cbc02d0bf15f', 
    redirectUri: 'https://yellow-bay-0b3d1841e.7.azurestaticapps.net/' 
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
  }
});

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient()
    , { provide: PublicClientApplication, useValue: msalInstance }
  ]
};
