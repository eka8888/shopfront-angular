# Sprint 1: Project Setup & Component Basics (`@angular/core`)

## What was done

- Implemented the Home page layout, including Hero, Categories, Promo, and New Arrivals sections.
- Integrated mock data (categories, products) from a JSON file.
- Set up a Notion project board for task tracking.

## Key components of the main page

### CategoriesSection

Displays product categories.
- Uses `@for` loop to generate category items
- Uses `routerLink` for navigation without page reload

**CategoryService** (injected via `inject()`):
- Provides mock data from JSON
- Uses signals (`signal()`) for state management
- Dynamically generates `slug` and image paths

### NewArrivalsSection

Displays new products.
- Uses `@for` loop to generate product cards
- Injects `ProductService` and `CartService` via `inject()`
- `handleAddToCart()` delegates logic to `CartService`

**ProductService**:
- Dynamically generates image paths
- Uses `computed()` to filter new arrivals by the `isNew` flag

## Problems

- Initially struggled with understanding where to store mock data (JSON or just a constant).
- Had to figure out how to generate dynamic slugs and image paths for categories without hardcoding them.
- Understanding how to properly inject services into standalone components and access their data in templates.

## Solutions

- Chose to store mock data in a separate JSON file and import it directly into services (CategoryService, ProductService, CartService).
- Implemented dynamic generation of slugs and image paths inside the service.
- Configured data flow through signal-based services.

## What I learned

- Creating and using standalone components
- Building components from dynamic data using `@for`
- Working with signals in Angular (`signal()`, `computed()`)
- Creating reusable services with mock data

## Plans for Sprint 2

- Implement lazy loading for at least 1 route
- Add a Route Guard (`canActivate` / `canDeactivate`)
- Continue to use `computed()` and start using `effect()` in components
- Create at least 2 services with `@Injectable()`

## Time spent

~ 10-12 hours
