import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  switchMap,
  throwError,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { PublicTokenService } from '../services/public-token';
import { Token } from '../services/token';

export interface ApiError {
  message: string;
  status: number;
  originalError: HttpErrorResponse;
}

export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  const tokenService = inject(Token);

  const publicTokenService = inject(
    PublicTokenService
  );

  const isCommercetoolsApi = request.url.startsWith(
    environment.apiUrl
  );


  if (!isCommercetoolsApi) {
    return next(request);
  }

  const isCustomerRequest =
    isCustomerSpecificRequest(request.url);

  if (isCustomerRequest) {
    const customerToken =
      tokenService.getCustomerToken();

    const authorizedRequest = customerToken
      ? addAuthorizationHeader(
          request,
          customerToken
        )
      : request;

    return next(authorizedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
      
        if (error.status === 401) {
          tokenService.clearCustomerToken();
        }

        return throwError(
          () => createApiError(error, true)
        );
      })
    );
  }


  return publicTokenService
    .ensurePublicToken()
    .pipe(
      switchMap((publicToken) => {
        const authorizedRequest =
          addAuthorizationHeader(
            request,
            publicToken
          );

        return next(authorizedRequest).pipe(
          catchError(
            (error: HttpErrorResponse) => {
              if (error.status !== 401) {
                return throwError(
                  () =>
                    createApiError(error, false)
                );
              }

              return publicTokenService
                .refreshPublicToken()
                .pipe(
                  switchMap(
                    (refreshedToken) => {
                      const retryRequest =
                        addAuthorizationHeader(
                          request,
                          refreshedToken
                        );

                      return next(retryRequest);
                    }
                  ),

                  catchError(
                    (
                      retryError:
                        HttpErrorResponse
                    ) =>
                      throwError(
                        () =>
                          createApiError(
                            retryError,
                            false
                          )
                      )
                  )
                );
            }
          )
        );
      }),

      catchError((error: unknown) => {
  
        if (isApiError(error)) {
          return throwError(() => error);
        }

        if (error instanceof HttpErrorResponse) {
          return throwError(
            () => createApiError(error, false)
          );
        }

        return throwError(
          (): ApiError => ({
            message:
              'Unable to initialize API authorization.',
            status: 0,
            originalError:
              new HttpErrorResponse({
                error,
                status: 0,
                statusText:
                  'Authorization initialization failed',
              }),
          })
        );
      })
    );
};

function isCustomerSpecificRequest(
  url: string
): boolean {
  const projectPath =
    `/${environment.projectKey}`;

  return (
    url.includes(`${projectPath}/me`) ||
    (
      url.includes(`${projectPath}/in-store/`) &&
      url.includes('/me')
    )
  );
}

function addAuthorizationHeader<T>(
  request: HttpRequest<T>,
  token: string
): HttpRequest<T> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function createApiError(
  error: HttpErrorResponse,
  isCustomerRequest: boolean
): ApiError {
  let message =
    'Something went wrong. Please try again.';

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
    message =
      'The requested resource was not found.';
  } else if (error.status === 409) {
    message =
      'Data was changed. Please refresh and try again.';
  } else if (error.status >= 500) {
    message =
      'The server is currently unavailable. Please try again later.';
  }

  return {
    message,
    status: error.status,
    originalError: error,
  };
}

function isApiError(
  error: unknown
): error is ApiError {
  if (
    typeof error !== 'object' ||
    error === null
  ) {
    return false;
  }

  return (
    'message' in error &&
    'status' in error &&
    'originalError' in error
  );
}