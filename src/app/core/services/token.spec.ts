import { TestBed } from '@angular/core/testing';
import { Token } from './token';

describe('Token', () => {
  let service: Token;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(Token);
  });

  it('should save token to localStorage', () => {
    service.setToken('test-token');

    expect(localStorage.getItem('access_token')).toBe('test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should clear token from localStorage', () => {
    service.setToken('test-token');
    service.clearToken();

    expect(service.getToken()).toBeNull();
  });
});