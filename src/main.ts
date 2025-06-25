import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ✅ Import this
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { App} from './app/app';
import { routes } from './app/app.routes'; // Adjust path as needed

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // ✅ Add this to fix HttpClient injection
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
    provideAuth(() => getAuth())
  ]
});
