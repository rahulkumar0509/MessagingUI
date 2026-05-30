import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';

// Paste your actual IDs here
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'a4dd4c5f-fda6-4bde-8f21-cbc02d0bf15f', 
    authority: 'https://login.microsoftonline.com/66861b95-153a-4de5-9e9e-4f21625e3d01', 
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
