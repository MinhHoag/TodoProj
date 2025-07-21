import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { App} from './app/app';
import { routes } from './app/app.routes';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: "todoproj-40e90",
        appId: "1:892655967492:web:a4caf37ad01252caef0451",
        storageBucket: "todoproj-40e90.firebasestorage.app",
        apiKey: "AIzaSyDS13wgxgtqCjXin8CR7ZgbQLt4djUwlD0",
        authDomain: "todoproj-40e90.firebaseapp.com",
        messagingSenderId: "892655967492",
        measurementId: "G-Y1KQZJG9DQ"
      })
    ),
    provideAuth(() => getAuth()), provideFirebaseApp(() => initializeApp({ projectId: "todoproj-40e90", appId: "1:892655967492:web:a4caf37ad01252caef0451", storageBucket: "todoproj-40e90.firebasestorage.app", apiKey: "AIzaSyDS13wgxgtqCjXin8CR7ZgbQLt4djUwlD0", authDomain: "todoproj-40e90.firebaseapp.com", messagingSenderId: "892655967492", measurementId: "G-Y1KQZJG9DQ" })), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "todoproj-40e90", appId: "1:892655967492:web:a4caf37ad01252caef0451", storageBucket: "todoproj-40e90.firebasestorage.app", apiKey: "AIzaSyDS13wgxgtqCjXin8CR7ZgbQLt4djUwlD0", authDomain: "todoproj-40e90.firebaseapp.com", messagingSenderId: "892655967492", measurementId: "G-Y1KQZJG9DQ" })), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "todoproj-40e90", appId: "1:892655967492:web:a4caf37ad01252caef0451", storageBucket: "todoproj-40e90.firebasestorage.app", apiKey: "AIzaSyDS13wgxgtqCjXin8CR7ZgbQLt4djUwlD0", authDomain: "todoproj-40e90.firebaseapp.com", messagingSenderId: "892655967492", measurementId: "G-Y1KQZJG9DQ" })), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())
  ]
});
