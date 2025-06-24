import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

bootstrapApplication(App, {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "todoproj-40e90", appId: "1:892655967492:web:a4caf37ad01252caef0451", storageBucket: "todoproj-40e90.firebasestorage.app", apiKey: "AIzaSyDS13wgxgtqCjXin8CR7ZgbQLt4djUwlD0", authDomain: "todoproj-40e90.firebaseapp.com", messagingSenderId: "892655967492", measurementId: "G-Y1KQZJG9DQ" })), provideAuth(() => getAuth())]
});
