import { TestBed } from '@angular/core/testing';

import { PublicToken } from './public-token';

describe('PublicToken', () => {
  let service: PublicToken;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicToken);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
