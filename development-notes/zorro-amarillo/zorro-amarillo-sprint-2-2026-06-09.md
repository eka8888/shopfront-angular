# Sprint 2: Routing & Signals (`@angular/router`, `@angular/core`)

## What was done

- Implemented Shop page (`/shop`) with lazy loading
- Implemented Product Details page with lazy loading and route parameters (`/shop/:id`)
- Implemented Cart page (`/cart`) with lazy loading
- Configured lazy loading for shop, product details, and cart routes using `loadChildren` and `loadComponent`

## Key components and services

### ShopPage

Displays product catalog with grid layout.
- Lazy loaded via `loadChildren` in main routes
- Wrapper component that contains Catalog component

**Catalog Component:**
- Injects `ProductService` and `CartService`
- Uses `@for` loop to generate product cards
- Emits `addToCart` event to parent, parent calls CartService

### ProductDetailsPage

Displays detailed product information.
- Lazy loaded route `/shop/:id` via `loadComponent`
- Reads product id from URL via `ActivatedRoute`
- `computed()` for product data, cart quantity, old price
- Conditional button (`Add to Cart` / `Remove from Cart`) based on cart status
- Shows quantity selector only when product is in cart
- Uses CurrencyPipe for price formatting
- `@let` in template for single signal subscription

### CartPage

Displays cart items in grid layout.
- Cart page with lazy loading (`loadComponent`)
- `effect()` for automatic localStorage save
- Increase/decrease quantity, and remove from cart functionality
- Empty cart state with "Go to Shop" button
- Uses CurrencyPipe for price formatting

### CartService

Manages cart state using signals (`signal()`, `computed()`).
- `effect()` — automatically saves cart to localStorage
- Methods: `addToCart()`, `removeFromCart()`, `increaseQuantity()`, `decreaseQuantity()`

### ProductService (enhanced in Sprint 2)

**Existing service extended with new methods:**

- `getOldPrice(id)` — calculates fake discounted price for visual comparison (original price + $20 markup, shown with strikethrough)
- `getProductDetailsImage(id)` — generates dynamic path to product detail image

### Shared Components

- QuantitySelector — reusable component with `input()` and `output()`
- Used in both Cart and Product Details pages
- Disabled minus button when quantity equals min value
- Uses `@let` in template for better performance (single signal subscription)

## Problems & Solutions

**Problem:** Initially forgot to call signals with `()` in computed and templates.
**Solution:** Learned to write `cartItems().length` instead of `cartItems.length`. Made this mistake a few times at first, but got used to it by the end of the sprint.

**Problem:** TypeScript error "Object is possibly 'undefined'" with `input()` in QuantitySelector.
**Solution:** Used `input.required()` instead of regular `input()` to guarantee value exists.

**Problem:** Had to figure out how to make QuantitySelector reusable
**Solution:** Made component reusable with `input()` and `output()`, parent handles cart logic using CartService.

## What I learned

- Creating routes with lazy loading (`loadComponent`, `loadChildren`)
- Reading route parameters with `ActivatedRoute`
- Working with signals in services (`signal()`, `computed()`, `effect()`)
- Saving state to localStorage with `effect()`
- Creating reusable components with `input()` and `output()`
- Using `@let` in templates for better signal performance

## Plans for Sprint 3

- Add custom directives and pipes
- Add Product image gallery (for multiple images)
- Handle click to enlarge product photo
- Add product variants (color selection)

## Time spent

~ 16-18 hours
