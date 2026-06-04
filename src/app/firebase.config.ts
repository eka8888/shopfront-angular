import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { InjectionToken } from '@angular/core';

const firebaseConfig = {
  apiKey: 'AIzaSyDetCWvmy-sWmjm1fjDL3y4AxW5i1ncfKk',
  authDomain: 'shopfront-angular.firebaseapp.com',
  projectId: 'shopfront-angular',
  storageBucket: 'shopfront-angular.firebasestorage.app',
  messagingSenderId: '654395477628',
  appId: '1:654395477628:web:cf518f1c3b2f30d46b43f9',
  measurementId: 'G-VNLHX7EBYW',
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const firestore: Firestore = getFirestore(app);

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const FIRESTORE = new InjectionToken<Firestore>('FIRESTORE');

export const firebaseProviders = [
  { provide: FIREBASE_APP, useValue: app },
  { provide: FIRESTORE, useValue: firestore },
];
