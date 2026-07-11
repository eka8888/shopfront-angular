import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { Token } from '../services/token';
import { environment } from '../../../environments/environment';

export interface ApiError {
  message: string;
  status: number;
  originalError: HttpErrorResponse;
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(Token);

  const isCommercetoolsApi = request.url.startsWith(
    environment.apiUrl
  );

  /*
   * OAuth token requests are sent to authUrl, not apiUrl.
   * Therefore, they pass through without a Bearer token.
   */
  if (!isCommercetoolsApi) {
    return next(request);
  }

  const projectPath = `/${environment.projectKey}`;

  /**
   * Customer-specific requests.
   *
   * Covers:
   * /me
   * /me/password
   * /me/carts
   * /me/orders
   * and other /me endpoints.
   */
  const isCustomerRequest =
    request.url.includes(`${projectPath}/me`) ||
    request.url.includes(`${projectPath}/in-store/`) &&
      request.url.includes('/me');

  const selectedToken = isCustomerRequest
    ? tokenService.getCustomerToken()
    : tokenService.getPublicToken();

  const authorizedRequest = selectedToken
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${selectedToken}`,
        },
      })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        message =
          'Network error. Please check your internet connection.';
      } else if (error.status === 400) {
        message =
          error.error?.message ??
          'Invalid request data.';
      } else if (error.status === 401) {
        message = isCustomerRequest
          ? 'Your session has expired. Please login again.'
          : 'Public API authorization failed.';
      } else if (error.status === 403) {
        message =
          'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 409) {
        message =
          'Data was changed. Please refresh and try again.';
      } else if (error.status >= 500) {
        message =
          'The server is currently unavailable. Please try again later.';
      }

      return throwError(
        (): ApiError => ({
          message,
          status: error.status,
          originalError: error,
        })
      );
    })
  );
};