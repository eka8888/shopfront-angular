import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Token } from '../services/token';
import { environment } from '../../../environments/environment';

export interface ApiError {
  message: string;
  status: number;
  originalError: HttpErrorResponse;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const token = tokenService.getToken();

  const isCommerceToolsApi = req.url.startsWith(environment.apiUrl);

  const authReq =
    token && isCommerceToolsApi
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        message = 'Network error. Please check your internet connection.';
      } else if (error.status === 400) {
        message = error.error?.message ?? 'Invalid request data.';
      } else if (error.status === 401) {
        message = 'Session expired. Please login again.';
      } else if (error.status === 409) {
        message = 'Data was changed. Please refresh and try again.';
      }

      return throwError((): ApiError => ({
        message,
        status: error.status,
        originalError: error,
      }));
    })
  );
};