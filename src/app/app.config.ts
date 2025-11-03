import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'danotes-983af',
          appId: '1:1072903868673:web:f83d67b1268e703ccc0b00',
          storageBucket: 'danotes-983af.firebasestorage.app',
          apiKey: 'AIzaSyCtBzpvmScJj8Q4e4A3Jbr5rcE7rW3wNTw',
          authDomain: 'danotes-983af.firebaseapp.com',
          messagingSenderId: '1072903868673',
          //projectNumber: '1072903868673',
          //version: '2',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
