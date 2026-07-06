import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { Auth } from './auth';
import { Token } from './token';
import { AuthStore } from '../stores/auth.store.store';
import { environment } from '../../../environments/environment';
import { CustomerProfile, TokenResponse } from '../models/auth.interface';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  const tokenServiceMock = {
    setToken: vi.fn(),
    getToken: vi.fn(),
    clearToken: vi.fn(),
  };

  const authStoreMock = {
    setLoading: vi.fn(),
    setError: vi.fn(),
    setToken: vi.fn(),
    setProfile: vi.fn(),
    clearToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        Auth,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Token,
          useValue: tokenServiceMock,
        },
        {
          provide: AuthStore,
          useValue: authStoreMock,
        },
      ],
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login, send POST request and save token', () => {
    const mockResponse: TokenResponse = {
      access_token: 'test-access-token',
      expires_in: 3600,
      scope: 'manage_project',
      token_type: 'Bearer',
    };

    service
      .login({
        email: 'test@email.com',
        password: 'Password123',
      })
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${environment.authUrl}/oauth/${environment.projectKey}/customers/token`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toContain('grant_type=password');
    expect(req.request.body).toContain('username=test%40email.com');
    expect(req.request.body).toContain('password=Password123');

    req.flush(mockResponse);

    expect(authStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(authStoreMock.setError).toHaveBeenCalledWith(null);
    expect(tokenServiceMock.setToken).toHaveBeenCalledWith('test-access-token');
    expect(authStoreMock.setToken).toHaveBeenCalledWith('test-access-token');
    expect(authStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  it('should get current customer profile and save it to store', () => {
    const mockProfile: CustomerProfile = {
      id: 'customer-id',
      version: 1,
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '2000-01-01',
      addresses: [],
    };

    service.getMyProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/${environment.projectKey}/me`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockProfile);

    expect(authStoreMock.setLoading).toHaveBeenCalledWith(true);
    expect(authStoreMock.setError).toHaveBeenCalledWith(null);
    expect(authStoreMock.setProfile).toHaveBeenCalledWith(mockProfile);
    expect(authStoreMock.setLoading).toHaveBeenCalledWith(false);
  });

  it('should return true when token exists', () => {
    tokenServiceMock.getToken.mockReturnValue('existing-token');

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false when token does not exist', () => {
    tokenServiceMock.getToken.mockReturnValue(null);

    expect(service.isAuthenticated()).toBe(false);
  });
});