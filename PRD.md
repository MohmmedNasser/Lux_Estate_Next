# PRD — Real Estate Website

> Main product requirements document. This is the single source of truth for the project.
> Frontend details: see `PRD-FRONTEND.md`
> Backend details: see `PRD-BACKEND.md`

---

## 1. Overview

A simple real estate web platform where users can browse properties for sale or rent, view property details, register an account, and list their own properties. The focus is on simplicity and usability — not an enterprise-scale marketplace.

**Project name:** Lux Estate
**Type:** Web application
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + framer-motion + shadcn/ui (on Base UI, not Radix)
**Brand accent:** amber-700, wired through the `--primary` design token in `app/globals.css` (so `bg-primary` == `bg-amber-700`)

---

## 2. Goals

- Let visitors browse and filter properties easily, without needing an account
- Let registered users list their own properties in a few simple steps
- Let interested users contact a property owner to buy or rent
- Keep the codebase small, readable, and easy to extend later

---

## 3. Target Users

| User                        | Needs                                                         |
| --------------------------- | ------------------------------------------------------------- |
| **Buyer / Renter**          | Search and filter properties, view details, contact the owner |
| **Property Owner / Seller** | Register, publish a listing, manage their own listings        |
| **Visitor (guest)**         | Browse properties without signing up                          |

---

## 4. Scope

### In Scope

- Browse properties (Buy / Rent)
- Filtering on the home page and on the all-properties page
- Property details page
- User registration and login
- Add / edit / delete own property
- Basic user dashboard ("My Listings")
- Contact / inquiry for buying or renting
- Static pages: About, Contact, 404

### Out of Scope (v1)

- Online payments or transactions
- Real-time chat between users
- Agent / agency profiles
- Multi-language support
- Admin panel and moderation
- Mortgage calculator, virtual tours, saved searches, price alerts
- Reviews and ratings

---

## 5. Core User Flows

**Browse & Inquire**
Home → filter or click a property → Property Details → "Buy Now" / "Rent Now" → contact form submitted

**Register & List**
Sign Up → Login → Add Property → fill form → publish → appears in Dashboard and in All Properties

**Manage Listings**
Login → Dashboard → My Listings → edit or delete a listing

---

## 6. Shared Data Types

> These types are the contract between frontend and backend.
> The frontend uses them for mock data in Phase 1; the backend must match them in Phase 2.

```ts
export type ListingType = "buy" | "rent";

export type PropertyType =
    | "apartment"
    | "villa"
    | "house"
    | "land"
    | "office"
    | "shop";

export interface Property {
    id: string;
    title: string;
    description: string;
    propertyType: PropertyType;
    listingType: ListingType;
    price: number;
    currency: string; // e.g. "USD"
    location: string; // city or area name
    address?: string;
    bedrooms: number;
    bathrooms: number;
    size: number; // in square meters
    amenities: string[]; // e.g. ["parking", "elevator", "garden"]
    images: string[]; // image URLs
    ownerId: string;
    createdAt: string; // ISO date string
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
}

export interface Inquiry {
    id: string;
    propertyId: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    message: string;
    createdAt: string;
}

export interface PropertyFilters {
    listingType?: ListingType;
    propertyType?: PropertyType;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    sortBy?: "newest" | "price-asc" | "price-desc" | "beds-desc";
}
```

---

## 7. Pages Overview

| Route                   | Page             | Auth Required |
| ----------------------- | ---------------- | ------------- |
| `/`                     | Home             | No            |
| `/properties`           | All Properties   | No            |
| `/properties/[id]`      | Property Details | No            |
| `/properties/add`       | Add Property     | Yes           |
| `/properties/[id]/edit` | Edit Property    | Yes (owner)   |
| `/login`                | Login            | No            |
| `/signup`               | Sign Up          | No            |
| `/dashboard`            | User Dashboard   | Yes           |
| `/about`                | About Us         | No            |
| `/contact`              | Contact Us       | No            |
| `*`                     | 404 Not Found    | No            |

---

## 8. Project Phases

### Phase 0 — Setup

Next.js project initialization, Tailwind, shadcn/ui, folder structure, base layout.

### Phase 1 — Frontend (Mock Data)

Build every page one at a time using mock data only. No backend, no auth logic.
→ See `PRD-FRONTEND.md`

### Phase 2 — Backend

Database, authentication, API routes, connecting the frontend to real data.
→ See `PRD-BACKEND.md`

### Phase 3 — Polish & Deploy

Responsiveness review, SEO metadata, validation, error handling, deployment.

---

## 9. Ground Rules for AI Assistants

- Build **one page at a time**. Do not scaffold the entire site in a single step.
- In Phase 1, use **mock data only** — no database calls, no auth logic.
- All mock data must match the types in section 6 exactly.
- Reuse shared components (e.g. `FeaturedPropertyCard`, `FilterSidebar`) instead of duplicating markup.
- Do not add features listed under **Out of Scope**.
- Keep components small and typed with TypeScript.
