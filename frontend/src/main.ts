import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  ]
})
.catch(err => console.error(err));

bootstrapApplication(AppModule, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  ]
})
.catch(err => console.error(err));