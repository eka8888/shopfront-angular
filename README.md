# 🛍️ ShopFront – RSS Angular Sprint Project

## Team Members

- [eka8888](https://github.com/eka8888)
- [zorro-amarillo](https://github.com/zorro-amarillo)
- [S-Arashu](https://github.com/s-arashu)

---

# Project Overview

**ShopFront** is an e-commerce web application built with Angular as part of the RS School Angular course.

The project demonstrates modern Angular development practices, including authentication, routing, reusable components, API integration, state management, and testing.

---

# Live Demo 🚀

👉 https://shopfront-angular.vercel.app

---

# Features

## Authentication

- Customer Registration
- Customer Login
- Customer Logout
- Protected Profile Page
- Route Guards
- Token Management

## Customer Profile

- Update Personal Information
- Manage Customer Addresses
- Default Shipping Address
- Default Billing Address

## Shopping

- Product Catalog
- Product Details
- Product Search
- Shopping Cart

## Angular Features

- Standalone Components
- Angular Routing
- Lazy Loading
- Reactive Forms
- Angular Signals
- RxJS
- Dependency Injection
- HttpClient
- HTTP Interceptors
- Unit Testing

---

# Technologies

- Angular
- TypeScript
- SCSS
- Angular Router
- Reactive Forms
- Angular Signals
- RxJS
- HttpClient
- NgRx Signal Store
- Jest
- ESLint
- Commercetools API

---

# Project Structure

The project follows a feature-based architecture.

```text
src
└── app
    ├── core
    │   ├── guards
    │   ├── interceptors
    │   ├── models
    │   ├── services
    │   └── stores
    │
    ├── features
    │
    ├── layout
    │
    └── shared
        ├── adapters
        ├── components
        ├── constants
        ├── data
        ├── interfaces
        ├── pipes
        └── services
```

---

# Architecture

### Core

Contains application-wide functionality shared across the entire application.

Includes:

- Route Guards
- HTTP Interceptors
- Global Services
- Models
- State Stores

---

### Features

Contains business modules grouped by application functionality.

Examples include:

- Authentication
- Shop
- Cart
- Home
- Contact
- About

---

### Layout

Contains the application's overall page layout and routing structure.

---

### Shared

Contains reusable functionality used throughout the application.

Includes:

- UI Components
- Shared Services
- Pipes
- Interfaces
- Constants
- Adapters
- Data
- Utility classes

---

# Developer Notes

The application follows Angular best practices and is organized using a feature-based architecture.

Main Angular concepts used throughout the project include:

- Standalone Components
- Reactive Forms
- Angular Signals
- RxJS
- Dependency Injection
- Lazy Loading
- Route Guards
- HTTP Interceptors
- Reusable Shared Components
- State Management

---

# Sprint 4 Video Proof

🎥 https://drive.google.com/file/d/1NekSxPp7suBNXMg5da-odcJoQubwk82_/view?usp=sharing

The Sprint 4 demonstration includes:

- Login Validation
- Login API Error Handling
- Network Error Handling
- Successful Login
- Profile Update
- Logout

---

# Setup Instructions

## Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- Angular CLI

Check your installed versions:

```bash
node -v
npm -v
ng version
```

## Clone the Repository

```bash
git clone <repository-url>
cd shopfront
```

## Install Dependencies

```bash
npm install
```

## Start the Development Server

```bash
npm start
```

or

```bash
ng serve
```

The application will be available at:

```
http://localhost:4200
```

## Build the Project

```bash
npm run build
```

## Run Unit Tests

```bash
npm test
```

## Run ESLint

```bash
npm run lint
```

---

# Repository

Developed as part of the **RS School Angular Course**.