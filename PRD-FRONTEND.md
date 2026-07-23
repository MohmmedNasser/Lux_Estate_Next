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
├── about/         # AboutHero, WhyWeStarted, ValuesGrid, TeamGrid
├── property/      # FeaturedPropertyCard (canonical grid card) + PropertyCardHorizontal (list-view sibling), gallery + full property-detail set (see §3)
├── properties/    # /properties page shell: PropertiesHeader, FilterSidebar, MobileFilterSheet, FilterChips, ResultsToolbar, PropertiesGrid (see §3)
├── auth/          # LoginForm, SignupForm (both render inside ui/AuthShell)
├── contact/       # ContactForm, ContactInfo
├── dashboard/     # ProfileHeader, StatCard (+ StatsGrid), ListingCard, DashboardListings
├── property-form/ # Add/Edit Property guided-flow pieces: Stepper, SectionCard, ListingTypeControl, NumberStepperInput, AmenityChips, ImageDropzone, FormActionBar
├── forms/         # PropertyForm — the single form shared by Add and Edit Property (mode prop)
└── ui/            # shadcn/ui primitives (Base UI): button, sheet, select, native-select, form-field, alert-dialog, AuthShell, ConfirmDialog

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

### `FeaturedPropertyCard`
Image with a **For Sale** / **For Rent** badge overlay · price (large, bold, over a gradient scrim) · title · location with a pin icon · a row of beds / baths / size icons · a Save (heart) toggle.
Hover (hover-capable devices only): slight lift and image zoom. Entire card links to `/properties/[id]`. `components/property/FeaturedPropertyCard` is the single, canonical listing card — reused for featured, grid, and "Similar properties"; there is no separate fork. (`components/home/FeaturedPropertyCard` is a distinct, smaller card used only as the hero image overlay.)

### `PropertyCardHorizontal`
The list-view sibling of `FeaturedPropertyCard` — same badge, favorite-heart, price, and meta-row tokens, laid out `flex-row` (image left, content right) instead of stacked; `flex-col` below `sm` so a fixed-width image never breaks a narrow screen. Both cards omit the bedrooms stat entirely when a listing has 0 bedrooms (commercial listings) rather than rendering a bare "0 beds".

### `/properties` filter system
Filters are still URL state (`lib/property-filters.ts`), not a client store. The page composes:
- **`FilterSidebar`** (desktop, `lg:sticky`) — batched draft state (Looking To segmented control, Location/Property Type `Select`, Price Range, Bedrooms/Bathrooms pill groups) committed via a single "Show Results" button; a header row shows "Clear all" once any filter is **applied** (URL-derived, independent of the draft).
- **`MobileFilterSheet`** (`< lg`) — the same field groups inside a bottom sheet (reusing `components/ui/sheet.tsx`, `side="bottom"`, Base UI's built-in focus trap/Esc/scroll-lock); its submit button shows a **live** "Show N results" count computed from the in-progress draft.
- **`FilterChips`** — pills for every currently-applied filter (not the draft), each removable independently; appears in both the sidebar/sheet header and as a standalone strip under the toolbar on `< lg`.
- **`ResultsToolbar`** — sort `Select` (Newest / Price asc / Price desc / Most Beds) and a segmented grid/list view toggle (both instant-apply, animated with a shared `layoutId` pill), plus quick Buy/Rent chips and the `MobileFilterSheet` trigger on `< lg`.
- **`PropertiesGrid`** — renders `FeaturedPropertyCard` (grid) or `PropertyCardHorizontal` (list), the empty state, and "Load More" (client-side reveal over the already-filtered array, since Phase 1 has no pagination API — new batches animate in on their own, the initial batch keeps its `whileInView` reveal). Grid columns: 1 → `sm:` 2 → `xl:` 3 (deliberately not `lg:` 3 — the 280px sidebar makes 3 columns cramped between `lg` and `xl`).

### Property-detail components
The `/properties/[id]` page is composed from dedicated components (see §4.3):
`PropertyHeader` · `PropertyGallery` + `GalleryLightbox` · `PropertyOverview` · `AmenitiesGrid` · `LocationMap` · `OwnerCard` · `InquiryModal` · `MobileActionBar` · `SimilarProperties`. Server components wherever no state is needed; the gallery, lightbox, owner card, inquiry modal, mobile bar, and similar-properties reveal are client components.

---

## 4. Page Specifications

### 4.1 Home — `/`

1. **Header**
2. **Hero** — full-width background image, overlay, headline + subheadline, an inline search bar (own local state, not the `/properties` filter components) floating over the image; desktop inline fields, mobile `Sheet`
3. **Featured Properties** — section title + a `stagger`/`fadeUp` grid of `FeaturedPropertyCard` with 6 mock properties + "View All Properties" button
4. **How It Works** — 3 steps with icons: Browse Properties → Contact the Owner → Move In
5. **CTA Banner** — "Have a property to list?" + "Add Your Property" button
6. **Footer**

---

### 4.2 All Properties — `/properties`

1. **`PropertiesHeader`** — breadcrumb (Home / Properties), page title, and a live (`aria-live`) result count ("14 properties found").
2. **`FilterSidebar`** (`lg:sticky`, hidden below `lg`) — batched draft filters (Looking To segmented control, Location/Property Type, Price Range, Bedrooms/Bathrooms pills) committed with one "Show Results" button; "Clear all" + `FilterChips` appear once a filter is actually applied (URL state), independent of the in-progress draft.
3. **`MobileFilterSheet`** (`< lg`) — the same field groups in a bottom sheet, trigger button lives in `ResultsToolbar`; its submit button shows a live "Show N results" count.
4. **`ResultsToolbar`** — sort (Newest / Price: Low to High / Price: High to Low / Most Beds) + a grid/list view toggle (segmented, `layoutId` slide), quick Buy/Rent chips and the mobile filter trigger on `< lg`, and a `FilterChips` strip below `lg` so active filters stay visible without opening the sheet.
5. **`PropertiesGrid`** — `FeaturedPropertyCard` grid or `PropertyCardHorizontal` list, "Load More" (client-side reveal, `PropertyCardSkeleton` while the next batch "loads"), and the empty state ("No properties match your filters" + "Clear all filters").

Filters update the URL query string (e.g. `/properties?listingType=rent&bedrooms=2`); `lib/property-filters.ts` remains the only place that parses and applies them.

---

### 4.3 Property Details — `/properties/[id]`

Modern listing layout (Airbnb/fleet style). The title block sits **above** the gallery so the user knows what the listing is before scrolling through photos.

1. **`PropertyHeader`** — breadcrumb (Home / Properties / [Title]; "← Back to Properties" on mobile) → title row with Share / Save / Copy Link pills (each swaps to a check icon + confirmation label on success; no bare icon-only affordances) → meta row (status badge, property type · location). Scrolls the window to top on mount and whenever the property `id` changes, so navigating directly between two detail pages (e.g. via Similar Properties) doesn't leave the scroll position stranded.
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
   - Price restated · owner (avatar + verified badge, name, role) · phone/email contact rows. Owner avatar falls back to initials on an amber-50 circle when unset (real accounts have no avatar upload in Phase 2); the phone row only renders when the owner has one on file — `User.phone?` (PRD.md §6) is optional and unset by default, since Sign Up never collects it.
   - **One** primary CTA — "Request a Viewing" / "Request to Rent" — opens **`InquiryModal`** (the inquiry form is NOT open inline). Secondary "Save". Fine print.
5. **`MobileActionBar`** (`< lg`) — `fixed` bottom bar: price + `bd · ba`, CTA opens the same modal. Page adds bottom padding so content clears it.
6. **`InquiryModal`** — centered modal (desktop) / drag-dismiss bottom sheet (mobile). Fields: Name, Email, Phone (optional), Message (inputs `≥16px` on mobile to stop iOS zoom). Client validation, loading → success state, focus trap, Esc, focus restore.
7. **`SimilarProperties`** — 3 mock properties reusing `FeaturedPropertyCard`, staggered `whileInView` reveal.

---

### 4.4 Login — `/login` and Sign Up — `/signup`

Both share **`components/ui/AuthShell`** — centered card (`max-w-[420px]`) over a faint amber radial glow, logo mark above the card, `scaleIn` entrance. `components/auth/LoginForm` and `components/auth/SignupForm` render inside it.

- **Login:** email, password (eye toggle), "Remember me" (custom checkbox), "Forgot password?" link, Login button (loading spinner state)
- **Sign Up:** full name, email, password (eye toggle) with a 3-segment strength meter + hint, confirm password, Sign Up button
- Both wire up an inline error banner above the form (`AnimatePresence` fade+height) for a failed-auth state; Phase 1 has no real auth backend so it never actually fires, but the component is ready for one
- Link at the bottom to switch between the two pages
- Client-side validation with inline error messages via the shared `FormField`
- No auth logic in Phase 1 — the submit button just logs to the console and shows a demo success line

---

### 4.5 Add Property — `/properties/add`

A guided flow built from `components/forms/PropertyForm` + `components/property-form/*`, not a flat stack of equal-weight cards:

- **`Stepper`** — sticky below the header (`top-16 lg:top-[72px]`), tracks the active section via `IntersectionObserver` (not scroll-position math). Desktop: 5 labeled dots + connecting line, completed steps get a check. `< sm`: collapses to "Step N of 5 — [label]" + a slim fill bar.
- **`SectionCard`** — each of the 5 sections gets a numbered badge (amber-50/amber-700) + title, `fadeUp` on `whileInView`, and a `scroll-mt-32` target `id` the stepper and validation both scroll to.
  1. **Basic Info** — title, description (`FormField` textarea), property type (styled `Select` Listbox), listing type (`ListingTypeControl`, sliding `layoutId` pill)
  2. **Pricing & Location** — price + a compact currency `Select`, location `Select`, address (optional badge next to the label)
  3. **Details** — bedrooms/bathrooms/size via `NumberStepperInput` (+/− buttons either side of the value, not bare number inputs)
  4. **Amenities** — `AmenityChips`: tappable pill toggles with a check icon that fades in, not checkbox-in-a-box
  5. **Images** — `ImageDropzone`: idle/drag-over/error states, shrinks to a compact "Add more" strip once photos exist, thumbnail grid with a hover/tap remove button
- **`FormActionBar`** — sticky footer (not buttons floating at the end of a long page): required-fields hint on the left, Cancel + Publish (loading spinner state) on the right; in edit mode the left slot becomes a "Delete Listing" trigger instead.
- **Validation** — inline per-field errors via `FormField`; submitting with an earlier incomplete section scrolls to and briefly rings that `SectionCard` (`ring-2 ring-rose-400`, fades via `transition-shadow`) instead of only flagging the field at the very bottom.

On submit in Phase 1, log the form data to the console and show a success panel with a link to the dashboard.

---

### 4.6 Edit Property — `/properties/[id]/edit`

The exact same `PropertyForm` as Add Property (same component, `mode="edit"`), pre-filled with mock data. Button label: "Save Changes". "Delete Listing" lives in the sticky `FormActionBar`'s left slot and opens `components/ui/ConfirmDialog` (`role="alertdialog"`, focus trap, Esc) before anything is removed.

---

### 4.7 Dashboard — `/dashboard`

- **`ProfileHeader`** — avatar, name, email, "Member since" date, "Edit Profile" button; stacks (avatar+name above, full-width button below) on `< sm`.
- **`StatCard`** (via `StatsGrid`, `stagger(0.08)` on mount) — total listings, for sale, for rent, each with a dark icon badge (`bg-neutral-900 text-amber-400`), matching the About page's Values-grid treatment rather than a pastel circle.
- **My Listings:** `DashboardListings` renders a grid of `components/dashboard/ListingCard` — shares `FeaturedPropertyCard`'s visual DNA (badge, price overlay, meta row) but swaps the favorite heart for an Edit/Delete button pair; Delete opens `ConfirmDialog` rather than removing on the first click. When bedrooms and bathrooms are both 0 (land/commercial), the meta row shows the property type instead of "0 beds · 0 baths".
- Empty state: "You haven't listed anything yet" + "Add Property" button, same visual pattern as the Properties page empty state.

---

### 4.8 About — `/about`

- Hero with page title
- Brand story / mission — two-column text and image
- Values or stats section (3–4 items with icons)
- Team section — 3–4 member cards (photo, name, role)

---

### 4.9 Contact — `/contact`

- Page header matches the Properties page pattern (H1 + subtext, `border-b`)
- Two columns (`components/contact/ContactForm` + `components/contact/ContactInfo`; info column moves below the form on `< lg`): form card (name, email, subject, message, success state via `AnimatePresence` crossfade — not a toast) on the left; contact detail rows with the same dark-icon-badge treatment as the About page's Values grid, plus the real `LocationMap` component (reused from the property-detail page — never a "coming soon" placeholder) on the right
- Both columns `fadeUp` on mount (above the fold), info column delayed 0.1s after the form

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
3. `FeaturedPropertyCard`, `PropertiesGrid`, `FilterSidebar`
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
