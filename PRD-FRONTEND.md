# PRD — Frontend

> Phase 1 specification. Build each page **one at a time**, using **mock data only**.
> All data shapes must match the shared types in `PRD.md` section 6.

---

## 1. Design Direction

- **Style:** clean, minimal, modern. Generous whitespace, no visual clutter.
- **Colors:** off-white background, dark charcoal text (`neutral-900`), **amber-700 as the single brand accent** for CTAs, active states, and links. The accent lives in the `--primary` / `--accent` design tokens in `app/globals.css` (`--ring` = amber-600) — style with `bg-primary` / `text-primary` OR the raw `amber-*` utilities; both resolve to the same amber. Do not introduce a second accent hue.
- **Typography:** one sans-serif family — **Inter** (`--font-sans`, loaded via `next/font`). Bold, confident headings; comfortable body text.
- **Corners & shadows:** subtle rounded corners, soft shadows on cards only.
- **Motion:** `framer-motion`. Reuse the shared variants/easing in `lib/motion.ts` (`fadeUp`, `scaleIn`, `stagger`, `viewportOnce`, `EASE`) — no new easings. Reveal-on-scroll uses `whileInView` + `viewport={{ once: true }}`; always honor `useReducedMotion()`.
- **Responsive:** mobile-first. Breakpoints at `xs` (25rem, custom), `sm`, `md`, `lg`, `xl`. Gate hover effects behind `@media (hover:hover)`.
- **States:** every interactive element needs hover, focus-visible (amber ring), active, and disabled states. Touch targets ≥ `h-11`.
- **Images:** `next/image` with `picsum.photos` placeholders (allow-listed in `next.config.ts`). Always pass correct `sizes` per breakpoint and descriptive `alt`.

---

## 2. Folder Structure

```
app/
├── layout.tsx
├── page.tsx                      # Home
├── not-found.tsx                 # 404
├── properties/
│   ├── page.tsx                  # All Properties
│   ├── add/page.tsx              # Add Property
│   └── [id]/
│       ├── page.tsx              # Property Details
│       └── edit/page.tsx         # Edit Property
├── login/page.tsx
├── signup/page.tsx
├── dashboard/page.tsx
├── about/page.tsx
└── contact/page.tsx

components/
├── layout/        # SiteHeader, NavLink, MobileNav, Footer, Container
├── home/          # Hero, FeaturedProperties, HowItWorks, CtaBanner, FeaturedPropertyCard (hero overlay card only)
├── property/      # PropertyCard, FeaturedPropertyCard (canonical listing card), grid, filters, gallery + full property-detail set (see §3)
├── forms/         # PropertyForm, ContactForm, AuthForm
└── ui/            # shadcn/ui primitives (Base UI): button, sheet, native-select, form-field, alert-dialog

hooks/
└── useScrollState.ts   # header scrolled state (single source of truth, hysteresis)

lib/
├── mock-data.ts        # mock properties, owners, users, inquiries
├── format.ts           # price / size / type / amenity / date formatters
├── property-filters.ts # parse + filter + sort (URL search params → results)
├── locations.ts        # location option list
├── validation.ts       # isValidEmail
├── motion.ts           # shared framer-motion variants + EASE
└── utils.ts            # cn()

types/
└── index.ts            # shared types from PRD.md
```

> Server Components by default; add `"use client"` only where interactivity requires it (forms, filters, gallery/lightbox, modals, motion, scroll state). Overlays (mobile nav, lightbox, inquiry modal) render through a **portal to `document.body`** so they escape the header's `backdrop-filter` containing block.

---

## 3. Shared Components

### `SiteHeader` (+ `NavLink`, `MobileNav`)
`fixed` top bar, `h-16 lg:h-[72px]`. Logo with amber mark (left) · nav centered on `lg+` (right) · Login + "Add Property" pill CTA.
**Two states driven by one boolean** (`useScrollState`, hysteresis 24/12px): State A = transparent over the dark home hero (light text + scrim); State B = solid `bg-white/85` blur bar. Background AND text color both derive from that single value so they can never desync into invisible text. Non-hero pages mount solid immediately (`variant` prop, auto-solid off the homepage). Active `NavLink` shows a sliding `layoutId` underline. Mobile: hamburger → full-screen overlay panel (`MobileNav`) with focus trap, Esc, scroll-lock, route-change close.

### `Footer`
Four columns: brand + short description, quick links, contact info, social icons. Copyright bar at the bottom.

### `PropertyCard` / `FeaturedPropertyCard`
Image with a **For Sale** / **For Rent** badge overlay · price (large, bold, over a gradient scrim) · title · location with a pin icon · a row of beds / baths / size icons · a Save (heart) toggle.
Hover (hover-capable devices only): slight lift and image zoom. Entire card links to `/properties/[id]`. `components/property/FeaturedPropertyCard` is the canonical card — reuse it for featured, grid, and "Similar properties"; do not fork a second variant. (`components/home/FeaturedPropertyCard` is a separate, smaller card used only as the hero image overlay.)

### `FilterBar`
Fields: Buy/Rent toggle · Location (select) · Property Type (select) · Price Range (min/max) · Bedrooms · Bathrooms · Search button.
Horizontal layout on the home page hero; vertical sidebar layout on the properties page. Same component, controlled by a `variant` prop.

### `PropertyGrid`
Responsive grid of `PropertyCard`: 1 column mobile, 2 tablet, 3 desktop. Handles empty state and loading skeletons.

### Property-detail components
The `/properties/[id]` page is composed from dedicated components (see §4.3):
`PropertyHeader` · `PropertyGallery` + `GalleryLightbox` · `PropertyOverview` · `AmenitiesGrid` · `LocationMap` · `OwnerCard` · `InquiryModal` · `MobileActionBar` · `SimilarProperties`. Server components wherever no state is needed; the gallery, lightbox, owner card, inquiry modal, mobile bar, and similar-properties reveal are client components.

---

## 4. Page Specifications

### 4.1 Home — `/`

1. **Header**
2. **Hero** — full-width background image, overlay, headline + subheadline, `FilterBar` (horizontal variant) floating over the image
3. **Featured Properties** — section title + `PropertyGrid` with 6 mock properties + "View All Properties" button
4. **How It Works** — 3 steps with icons: Browse Properties → Contact the Owner → Move In
5. **CTA Banner** — "Have a property to list?" + "Add Your Property" button
6. **Footer**

---

### 4.2 All Properties — `/properties`

- Page title + result count ("24 properties found")
- **Left sidebar:** `FilterBar` (vertical variant), sticky on desktop, collapsible drawer on mobile
- **Top bar:** sort dropdown (Newest, Price: Low to High, Price: High to Low) + Grid/List view toggle
- **Main area:** `PropertyGrid` (grid view) or stacked horizontal cards (list view)
- Pagination or "Load More" button
- Empty state when no properties match the filters

Filters update the URL query string (e.g. `/properties?listingType=rent&bedrooms=2`).

---

### 4.3 Property Details — `/properties/[id]`

Modern listing layout (Airbnb/fleet style). The title block sits **above** the gallery so the user knows what the listing is before scrolling through photos.

1. **`PropertyHeader`** — breadcrumb (Home / Properties / [Title]; "← Back to Properties" on mobile) → title row with Share / Save / More pills → meta row (status badge, property type · location).
2. **`PropertyGallery`** — mosaic gallery, not a hero + thumb strip:
   - `lg+`: 4-col / 2-row mosaic (big lead image + up to 4 tiles), only outer corners rounded.
   - `sm–lg`: wide lead image + a pair below.
   - `< sm`: full-bleed snap carousel with dot indicators.
   - "Show all N photos" button opens **`GalleryLightbox`** (portal, `AnimatePresence`, arrow-key + swipe nav, Esc, focus trap, scroll lock, `N / total` counter).
3. **Two-column body** (`lg:grid-cols-[1fr_380px]`, `xl:_400px`); left blocks divided by `border-b`:
   - **`PropertyOverview`** — price (`/mo` for rent), "Listed by [owner]" + avatar, inline spec `<dl>` (icon + value + word label; bedrooms/bathrooms hidden when 0).
   - **Description** — clamped prose (`max-w-[68ch]`).
   - **`AmenitiesGrid`** — 2-col grid; each amenity maps to a real lucide icon (Parking→Car, Garden→Trees, Balcony→Wind, A/C→Snowflake, …), never a generic check.
   - **`LocationMap`** — gridded map surface with a pinging amber pin + floating address card and an "Open in Maps" link. Never a "coming soon" box.
4. **`OwnerCard`** (right column, `lg:sticky lg:top-24`; on mobile renders in-flow after the description):
   - Price restated · owner (avatar + verified badge, name, role) · phone/email contact rows.
   - **One** primary CTA — "Request a Viewing" / "Request to Rent" — opens **`InquiryModal`** (the inquiry form is NOT open inline). Secondary "Save". Fine print.
5. **`MobileActionBar`** (`< lg`) — `fixed` bottom bar: price + `bd · ba`, CTA opens the same modal. Page adds bottom padding so content clears it.
6. **`InquiryModal`** — centered modal (desktop) / drag-dismiss bottom sheet (mobile). Fields: Name, Email, Phone (optional), Message (inputs `≥16px` on mobile to stop iOS zoom). Client validation, loading → success state, focus trap, Esc, focus restore.
7. **`SimilarProperties`** — 3 mock properties reusing `FeaturedPropertyCard`, staggered `whileInView` reveal.

---

### 4.4 Login — `/login` and Sign Up — `/signup`

- Centered card on a plain background, max width ~420px
- Logo at the top
- **Login:** email, password, "Remember me", "Forgot password?" link, Login button
- **Sign Up:** name, email, password, confirm password, Sign Up button
- Link at the bottom to switch between the two pages
- Client-side validation with inline error messages
- No auth logic in Phase 1 — the submit button just logs to the console

---

### 4.5 Add Property — `/properties/add`

Multi-section form on one page:

1. **Basic Info** — title, description (textarea), property type (select), Buy/Rent toggle
2. **Pricing & Location** — price, currency, location (select), address
3. **Details** — bedrooms, bathrooms, size (m²)
4. **Amenities** — checkbox grid (parking, elevator, garden, pool, balcony, furnished, air conditioning, security)
5. **Images** — drag-and-drop upload area with a preview thumbnail grid (UI only)
6. Cancel and "Publish Listing" buttons

Full client-side validation. On submit in Phase 1, log the form data to the console.

---

### 4.6 Edit Property — `/properties/[id]/edit`

Same form as Add Property, pre-filled with mock data. Button label: "Save Changes". Includes a "Delete Listing" button with a confirmation dialog.

---

### 4.7 Dashboard — `/dashboard`

- **Profile section:** avatar, name, email, "Edit Profile" button
- **Stats row:** total listings, for sale, for rent
- **My Listings:** grid of `PropertyCard` with an Edit and Delete button on each card
- Empty state: "You have no listings yet" + "Add Your First Property" button

---

### 4.8 About — `/about`

- Hero with page title
- Brand story / mission — two-column text and image
- Values or stats section (3–4 items with icons)
- Team section — 3–4 member cards (photo, name, role)

---

### 4.9 Contact — `/contact`

- Page title and short intro
- Two columns: contact form (name, email, subject, message) on the left; contact info (address, phone, email, working hours) + map placeholder on the right

---

### 4.10 404 — `not-found.tsx`

Centered: large "404", short friendly message, "Back to Home" button.

---

## 5. Mock Data Requirements

`lib/mock-data.ts` must export:

- `mockProperties: Property[]` — at least **12** properties, with a realistic mix of `buy` and `rent`, varied property types, locations, prices, and bedroom counts (needed to test filtering)
- `mockUser: User` — one user for the dashboard
- `mockInquiries: Inquiry[]` — 2–3 sample inquiries

All objects must match the types in `PRD.md` section 6 exactly.

---

## 6. Build Order

Build in this sequence, reviewing each step before continuing:

1. Phase 0 setup + `types/index.ts` + `lib/mock-data.ts`
2. `Header` and `Footer` + root layout
3. `PropertyCard`, `PropertyGrid`, `FilterBar`
4. Home page
5. All Properties page
6. Property Details page
7. Login / Sign Up pages
8. Add Property page
9. Edit Property page
10. Dashboard page
11. About / Contact / 404

---

## 7. Phase 1 Constraints

- Mock data only — no database, no API calls, no authentication
- No online payment, chat, agent profiles, multi-language, or admin panel
- Do not build any page before the one preceding it in the build order is approved
- Prefer Server Components; use `"use client"` only where interactivity requires it
