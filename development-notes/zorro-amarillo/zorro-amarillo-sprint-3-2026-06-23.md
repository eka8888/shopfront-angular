# Sprint 3: Directives, Pipes & Forms (@angular/core, @angular/forms)

## What was done

- Implemented product sorting with `ProductsSortPipe` (custom pipe)
- Implemented product search with `SearchService`
- Added nothing found state with redirect to `/shop` button
- Added `OnPush` change detection to `ProductDetailsPage`, `NothingFound`, and `SortingSelector`

## Key components and services

### SortingSelector

Reactive form component for product sorting.

- Uses `FormBuilder` and `ReactiveFormsModule`
- `output()` emits sort option to parent component (`Catalog`)
- Proper subscription cleanup with `DestroyRef`
- OnPush change detection

Sorting options:

- Name (asc/desc)
- Price (asc/desc)

### ProductsSortPipe

Custom pipe for sorting products.

- Pure pipe (default)
- Handles sorting by name and price in both directions (asc/desc)
- Used in catalog template with `@let` for single calculation

### SearchBar (enhanced in Sprint 3)

Search input component integrated into header.

- Originally created by team lead, extended for search functionality
- `input()` receives value from parent (`Header`)
- `output()` sends search event to parent
- Syncs with `SearchService` via `Header`

**My contribution:** Extended and configured `SearchBar` to work with `Header` and `SearchService` for product searching. It was already created by team lead, I added the integration logic.

### SearchService

Manages search state and navigation.

- `searchInput` signal - single source of truth for searching
- `searchProducts()` handles text input trim, and navigation
- `clearSearch()` resets search state

### ShopPage

Container component for product catalog.

- Reads the value of `searchFor` query from `queryParams`
- Writes new value to `SearchService.searchInput` signal
- Uses `DestroyRef` for proper cleanup

### Catalog

Displays found and sorted product list.

- Reads `searchInput` signal from `SearchService`
- Uses `computed()` for product filtering by search query
- Uses `@let` for single sorting calculation
- Shows `NothingFound` component for empty state

### NothingFound

Reusable component for empty states.

- Used in both `Catalog` (while searching) and `Cart` pages
- Uses `input()` for message, button text, and button link
- OnPush change detection

### ProductDetailsPage

Displays detailed product information. I added `OnPush` change detection for performance.

## Problems & Solutions

**Problem:** Search bar kept whitespace characters after navigating away from catalog.
**Solution:** Stored raw value in `SearchService.searchInput` signal - without applying `trim()` to it, and only trimmed value for navigation. This made signal changes visible to Angular's change detection.
I also learned that Angular batches signal changes — it waits for synchronous code to finish and sees the final value. To force DOM update, need to ensure the signal actually changes (for example, from ' ' to '').

**Problem:** VSCode showed error "ProductsSortPipe is not used within the template" even though pipe was imported and used.
**Solution:** Added `@let sortedProducts = updatedCatalog() | productsSort: selectedSort()` in template, trying to fix the error. But it persisted until restarting VSCode and server - it was a caching issue.

**Problem:** Search query in SearchBar remained after navigating away from catalog.
**Solution:** `Catalog.ngOnDestroy()` calls `searchService.clearSearch()`, which resets the signal (`searchInput` in service).

**Problem:** ShopPage subscription to `queryParams` could cause memory leak.
**Solution:** Used `DestroyRef` for cleanup — this is more modern than `ngOnDestroy` approach.

**Problem:** Had to figure out how to make search work from `Header` to `Catalog` component.
**Solution:** Created `SearchService` as single source of truth. `SearchBar` sends event to `Header`, `Header` calls `SearchService`, `Catalog` reads from this service.

**Problem:** Initially thought that `queryParams` need to be set somehow in the config for product searching.
**Solution:** Learned that `queryParams` don't need route configuration - they're automatically available via `ActivatedRoute.queryParams`.

**Problem:** Couldn't decide between using `FormGroup` vs `FormBuilder` for `SortingSelector`.
**Solution:** Used `FormBuilder` as recommended in the requirements. And learned that `FormBuilder` provides convenient methods (`group()`, `array()`) and cleaner syntax compared to manual `FormGroup` creation.

## What I learned

- Creating a custom pure pipe with `@Pipe` and `PipeTransform`
- Working with `ReactiveFormsModule` (`FormGroup`, `FormBuilder`)
- Using `OnPush` change detection with signals
- Using `DestroyRef` for subscription cleanup
- Preventing whitespace-only input in search bar
- Syncing state between queryParams and service signals
- Understanding `queryParams` don't need route configuration - they're automatically available
- Understanding Angular batches signal changes - final value matters, not intermediate ones

## Plans for Sprint 4

- Connect to commercetools API (HttpClient)
- Learn HTTP interceptors
- Add error handling and loading states
- Write tests

## Time spent

~ 18-20 hours
