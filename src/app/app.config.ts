import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { initializeApp ,provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { addHeadersInterceptor } from './services/add-headers.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const firebaseConfig = {
  apiKey: "AIzaSyBpTX9CYbZ_lrLcXfdzT51rdNl1KTfartY",
  authDomain: "invesfit-4dfaf.firebaseapp.com",
  projectId: "invesfit-4dfaf",
  storageBucket: "invesfit-4dfaf.appspot.com",
  messagingSenderId: "958843931573",
  appId: "1:958843931573:web:6a11ac60236f38a47967fc",
  measurementId: "G-EQHMJ8ME9X"
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)
    , provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideHttpClient(withFetch() , withInterceptors([addHeadersInterceptor])),
    TranslateModule.forRoot({
      defaultLanguage: 'EN',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }).providers!
  ]
};
