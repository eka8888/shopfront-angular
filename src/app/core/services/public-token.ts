import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  tap,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { Token } from './token';
import { TokenResponse } from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class PublicTokenService {
  private readonly httpBackend = inject(HttpBackend);
  private readonly tokenService = inject(Token);


  private readonly rawHttp = new HttpClient(this.httpBackend);


  private tokenRequest$: Observable<string> | null = null;

  ensurePublicToken(forceRefresh = false): Observable<string> {
    if (!forceRefresh) {
      const existingToken =
        this.tokenService.getPublicToken();

      if (existingToken) {
        return of(existingToken);
      }
    }

    if (this.tokenRequest$) {
      return this.tokenRequest$;
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    const request$ = this.rawHttp
      .post<TokenResponse>(
        `${environment.authUrl}/oauth/token`,
        body.toString(),
        {
          headers: this.getBasicAuthHeaders(),
        }
      )
      .pipe(
        tap((response) => {
          this.tokenService.setPublicToken(
            response.access_token,
            response.expires_in
          );
        }),

        map((response) => response.access_token),

        finalize(() => {
          this.tokenRequest$ = null;
        }),

        shareReplay({
          bufferSize: 1,
          refCount: false,
        })
      );

    this.tokenRequest$ = request$;

    return request$;
  }

  refreshPublicToken(): Observable<string> {
    this.tokenService.clearPublicToken();

    return this.ensurePublicToken(true);
  }

  private getBasicAuthHeaders(): HttpHeaders {
    const basicAuth = btoa(
      `${environment.clientId}:${environment.clientSecret}`
    );

    return new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }
}