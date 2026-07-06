# Sprint 4: HTTP, RxJS & Testing (`@angular/common/http`, `rxjs`, `@angular/core/testing`)

## What was done

- Connected catalog and product details to commercetools API
- Implemented product search - full-text search with fuzzy matching
- Added pagination with page navigation
- Updated `FilteringService` for category and price filters
- Updated `CategoryService` for fetching categories from CT
- Implemented 404 redirect for non-existent products
- Replaced mock data with real CT data (catalog and product details)
- Created `adaptCtToProduct` adapter for data transformation
- Added cart badge with items count
- Created `plurals` pipe for pluralization

---

## Key components and services

### ProductService

Manages product data from commercetools API.

- `fetchAllProducts()` — loads products from `/product-projections`
- `fetchProductByKey()` — loads single product by key
- `products` signal — stores all products
- `newArrivals` computed — shows 4 newest products

### SearchService

Handles search functionality with CT API.

- `searchProducts()` — triggers search and navigation
- `fetchFoundProducts()` — calls CT search endpoint with fuzzy matching
- `userInput` signal — stores current search query
- `searchResults` signal — stores search results

**Key learnings:** Search uses `text.en-US` with `fuzzy=true` for partial matches (for example, plare instead of plate).

### FilteringService

Manages category and price filters.

- `categories` signal — from `CategoryService`
- `categoryFilters` and `priceFilters` signals
- `filteredResults` computed — combines search + filters
- `filterByCategory()` — finds category by `name['en-US']`
- `filterByPrice()` — filters by price ranges

**Key learnings:** Categories in CT have `name` as an object with locales (`name['en-US']`). Comparing `category.name === 'Tableware'` didn't work — needed `category.name['en-US'] === 'Tableware'`.

### CategoryService

Fetches categories from CT API.

- `fetchCategories()` — GET request to `/categories` endpoint
- `allCategories` signal — stores categories with `id` and `name['en-US']`

### ProductDetailsPage

Displays single product with CT data.

- Reads product `key` from URL params
- `fetchProductByKey()` — loads product from CT
- Redirects to `/404` if product not found
- Product image from CT
- `effect()` for redirect

### Cart badge and plurals pipe

- `itemsQuantity` computed in `CartService` — sums item quantities
- Cart badge in header for `itemsQuantity`
- Reusable `plurals` pipe for pluralization: `{{ itemsQuantity() | plurals:'item':'items' }}`

---

## Problems & Solutions

**Problem:** 404 route wasn't accessible directly, only via wildcard `**`.
**Solution:** Added explicit `/404` route and redirected `**` to `/404`. This makes routing cleaner.

**Problem:** `router.navigate(['/404'])` inside `computed` might cause side effects.
**Solution:** Moved redirect to `effect()` in `ProductDetailsPage` — `effect` runs after component initialization and watches for changes.

**Problem:** Data from `/products` had nested structure, while `/product-projections` returned flat structure.
**Solution:** Switched to `/product-projections` for simpler data structure.

**Problem:** Search endpoint returned 401 Unauthorized.
**Solution:** Token wasn't being added to requests. After merging dev changes and getting token via login, search started working.

**Problem:** Search only matched exact full words.
**Solution:** Added `fuzzy=true` parameter to CT search endpoint — now matches partial words.

**Problem:** Initial page load showed "Nothing found" until search was typed.
**Solution:** Call search initially to load all products on page load.

**Problem:** `category.name === categoryName` returned false.
**Solution:** Categories from CT have `name` as object with locales. Changed to `category.name['en-US'] === categoryName`.

**Problem:** `isNew` field didn't exist in CT data.
**Solution:** Updated `newArrivals` to take first 4 products sorted by `createdAt`.

**Problem:** Different field names and structures between mocks and CT.
**Solution:** Created `adaptCtToProduct` adapter — a single place to transform CT data into `Product` interface.

**Problem:** SVG `stroke` color didn't change on hover.
**Solution:** Used `stroke="currentColor"` — SVG inherits text color from parent, so hover color changes automatically.

**Problem:** Filtering and search were difficult to combine.
**Solution:** Made search and filters independent — search is reactive (signal), filters go through form.

---

## What I learned

- Creating HTTP services with `HttpClient` and `Observable`
- Using `map` operator to transform API responses
- Working with `computed` and `signal` for reactive state
- Using `effect()` for side effects (redirects)
- Handling 404 redirects with explicit route
- Creating adapters for data transformation (CT → Product)
- Understanding Observables: `subscribe()` works with all streams (routing, forms, HTTP)
- Building a custom pipe for pluralization (`plurals`)
- Differentiating staged vs published products in CT
- Importance of checking exact field names in API responses

---

## Time spent

~ 37-40 hours
