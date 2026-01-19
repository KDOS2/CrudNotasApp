import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { routes } from './app.routes';
import { NgxPaginationModule } from 'ngx-pagination';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(NgxPaginationModule),
    provideToastr({
      positionClass: 'toast-top-center',
      timeOut: 3500,
      preventDuplicates: true,
    }),
    provideNgxMask(),
    importProvidersFrom(TooltipModule)
  ]
};