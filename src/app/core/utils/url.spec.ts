import { stripTrailingSlash } from './url';

describe('stripTrailingSlash', () => {
  it('should remove a single trailing slash', () => {
    expect(stripTrailingSlash('https://api.example.com/')).toBe('https://api.example.com');
  });

  it('should leave a URL without a trailing slash unchanged', () => {
    expect(stripTrailingSlash('https://api.example.com')).toBe('https://api.example.com');
  });

  it('should only remove one trailing slash, not repeated ones', () => {
    expect(stripTrailingSlash('https://api.example.com//')).toBe('https://api.example.com/');
  });
});
