# PRD — Backend

> Phase 2 specification. Start only after all Phase 1 frontend pages are built and approved.
> All models must match the shared types in `PRD.md` section 6.

---

## 1. Tech Stack

| Layer | Tool |
|---|---|
| Database | Neon (Serverless PostgreSQL) |
| ORM | Prisma |
| Authentication | Better Auth |
| Image Upload | Cloudinary |
| Validation | Zod |
| API Layer | Next.js Server Actions + Route Handlers |

---

## 2. Environment Variables

```env
# Neon
DATABASE_URL="postgresql://...?sslmode=require"
DIRECT_URL="postgresql://..."          # unpooled, for migrations

# Better Auth
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
```

Commit a `.env.example` with empty values. Never commit `.env`.

---

## 3. Database Schema (Prisma)

### Models

**User** — extended with Better Auth's required fields
- `id` (cuid, PK), `name`, `email` (unique), `emailVerified` (Boolean), `image`, `phone?`, `createdAt`, `updatedAt`
- Relations: `properties: Property[]`, `sessions: Session[]`, `accounts: Account[]`

**Session / Account / Verification** — required by Better Auth. Generate these from the Better Auth Prisma adapter docs; do not hand-write them.

**Property**
- `id` (cuid, PK), `title`, `description` (Text), `propertyType` (enum), `listingType` (enum), `price` (Decimal or Int), `currency` (default "USD"), `location`, `address?`, `bedrooms` (Int), `bathrooms` (Int), `size` (Int, m²), `amenities` (String[]), `images` (String[] — Cloudinary URLs), `status` (enum: ACTIVE | SOLD | RENTED, default ACTIVE), `ownerId` (FK → User, onDelete: Cascade), `createdAt`, `updatedAt`
- Relations: `owner: User`, `inquiries: Inquiry[]`
- Indexes on: `listingType`, `propertyType`, `location`, `price`, `ownerId`

**Inquiry**
- `id` (cuid, PK), `propertyId` (FK → Property, onDelete: Cascade), `senderName`, `senderEmail`, `senderPhone?`, `message` (Text), `createdAt`
- Relation: `property: Property`

### Enums
```prisma
enum ListingType { BUY RENT }
enum PropertyType { APARTMENT VILLA HOUSE LAND OFFICE SHOP }
enum PropertyStatus { ACTIVE SOLD RENTED }
```

> Prisma enums are uppercase; the frontend types are lowercase. Map between them in `lib/mappers.ts` — do not change the frontend types.

---

## 4. Neon + Prisma Setup

- Use `@prisma/adapter-neon` with the Neon serverless driver for pooled connections in serverless environments
- Use `DIRECT_URL` for migrations, `DATABASE_URL` (pooled) for runtime
- Create a singleton Prisma client in `lib/prisma.ts` with the standard `globalThis` guard to avoid connection exhaustion in dev

---

## 5. Authentication (Better Auth)

- Configure in `lib/auth.ts` with the Prisma adapter
- Enable **email + password** only (no social providers in v1)
- Password minimum length: 8
- Session strategy: database sessions, 7-day expiry
- Mount the handler at `app/api/auth/[...all]/route.ts`
- Create a typed client in `lib/auth-client.ts`
- Add `middleware.ts` protecting: `/dashboard`, `/properties/add`, `/properties/[id]/edit` → redirect unauthenticated users to `/login?callbackUrl=...`
- Create a `getCurrentUser()` server helper for use in Server Components and Server Actions

---

## 6. Validation (Zod)

All schemas live in `lib/validations/`. Each is used in **both** the client form and the server action — a single source of truth.

- `authSchemas.ts` — `signUpSchema`, `signInSchema`
- `propertySchemas.ts` — `createPropertySchema`, `updatePropertySchema`, `propertyFilterSchema`
- `inquirySchemas.ts` — `createInquirySchema`

Rules: title 5–100 chars · description 20–2000 chars · price positive · bedrooms/bathrooms 0–20 · size positive · images 1–10 URLs · valid email · message 10–1000 chars.

Export inferred types with `z.infer<>` and use them as the form types.

---

## 7. Image Upload (Cloudinary)

- Use **signed uploads**: a server action generates a signature; the client uploads directly to Cloudinary. Never expose the API secret to the client.
- Signature endpoint: `app/api/cloudinary/sign/route.ts` (authenticated users only)
- Upload folder: `real-estate/properties`
- Store the returned `secure_url` values in `Property.images`
- On property delete, also delete the images from Cloudinary using their `public_id`
- Constraints: max 10 images per property, max 5MB each, formats jpg/png/webp

---

## 8. Server Actions & API

Prefer **Server Actions** for mutations. Use Route Handlers only where an HTTP endpoint is genuinely needed.

### Properties — `lib/actions/property.actions.ts`

| Action | Auth | Description |
|---|---|---|
| `getProperties(filters)` | Public | List with filters, sorting, pagination |
| `getPropertyById(id)` | Public | Single property + owner info |
| `getFeaturedProperties(limit)` | Public | For the home page |
| `getSimilarProperties(id)` | Public | Same type/location, excluding current |
| `getMyProperties()` | Yes | Current user's listings |
| `createProperty(data)` | Yes | Validate with Zod, set `ownerId` from session |
| `updateProperty(id, data)` | Owner only | Verify ownership before updating |
| `deleteProperty(id)` | Owner only | Verify ownership, delete Cloudinary images |

**Filtering logic** for `getProperties`: build a dynamic Prisma `where` from `listingType`, `propertyType`, `location` (case-insensitive contains), `minPrice`/`maxPrice`, `bedrooms` (gte), `bathrooms` (gte), and `status: ACTIVE`. Sorting: `newest` → `createdAt desc`, `price-asc`, `price-desc`. Return `{ properties, total, page, totalPages }`.

### Inquiries — `lib/actions/inquiry.actions.ts`
- `createInquiry(data)` — public, validated with Zod
- `getMyInquiries()` — authenticated, returns inquiries on the current user's properties

### User — `lib/actions/user.actions.ts`
- `updateProfile(data)` — authenticated
- `getDashboardStats()` — total listings, count for sale, count for rent

---

## 9. Connecting the Frontend

Replace mock data page by page, in this order. Do not move on until each is verified.

1. **Home** — `getFeaturedProperties(6)`
2. **All Properties** — `getProperties(filters)`, filters read from `searchParams`, real pagination
3. **Property Details** — `getPropertyById`, `getSimilarProperties`, wire the inquiry form to `createInquiry`
4. **Login / Sign Up** — wire to Better Auth
5. **Add Property** — Cloudinary upload + `createProperty`
6. **Edit Property** — prefill from `getPropertyById`, wire `updateProperty` and `deleteProperty`
7. **Dashboard** — `getMyProperties` + `getDashboardStats`

Add loading states (`loading.tsx` / Suspense), error states (`error.tsx`), and empty states throughout. Call `revalidatePath` after every mutation.

---

## 10. Build Order

1. Install dependencies, configure `.env` and `.env.example`
2. Prisma schema + `lib/prisma.ts` + first migration + verify on Neon
3. Zod schemas
4. Better Auth config, route handler, client, middleware, `getCurrentUser`
5. Cloudinary config + signature endpoint + upload component
6. Property server actions
7. Inquiry + user server actions
8. Connect frontend pages (order in section 9)
9. Seed script with ~15 realistic properties
10. Error handling, loading states, final review

---

## 11. Constraints

- Every server action that mutates data must verify authentication and, where relevant, ownership
- Never trust client input — always parse with Zod on the server
- Never expose `CLOUDINARY_API_SECRET` or `BETTER_AUTH_SECRET` to the client
- Do not modify the frontend's shared types; use mappers for enum casing
- Do not add features listed as Out of Scope in `PRD.md`
