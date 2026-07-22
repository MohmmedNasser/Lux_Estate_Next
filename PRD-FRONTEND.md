# PRD — Frontend

> Phase 1 specification. Build each page **one at a time**, using **mock data only**.
> All data shapes must match the shared types in `PRD.md` section 6.

---

## 1. Design Direction

- **Style:** clean, minimal, modern. Generous whitespace, no visual clutter.
- **Colors:** off-white background, dark navy/charcoal text, one accent color for CTAs and active states.
- **Typography:** one sans-serif family. Bold, confident headings; comfortable body text.
- **Corners & shadows:** subtle rounded corners, soft shadows on cards only.
- **Responsive:** mobile-first. Breakpoints at `sm`, `md`, `lg`.
- **States:** every interactive element needs hover, focus, active, and disabled states.
- **Images:** use `next/image` with placeholder images from a service like `picsum.photos`.

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
├── layout/        # Header, Footer, Container
├── property/      # PropertyCard, PropertyGrid, FilterBar, PropertyGallery
├── forms/         # PropertyForm, ContactForm, AuthForm
└── ui/            # shadcn/ui components

lib/
├── mock-data.ts   # mock properties, users, inquiries
└── utils.ts

types/
└── index.ts       # shared types from PRD.md
```

---

## 3. Shared Components

### `Header`
Logo (left) · Nav links: Home, Properties, About, Contact (center) · "Add Property" button + Login/Avatar (right).
Sticky on scroll. Hamburger menu with a slide-in drawer on mobile.

### `Footer`
Four columns: brand + short description, quick links, contact info, social icons. Copyright bar at the bottom.

### `PropertyCard`
Image with a **Buy** or **Rent** badge overlay · price (large, bold) · title · location with a pin icon · a row of beds / baths / size icons.
Hover: slight lift and image zoom. Entire card links to `/properties/[id]`.

### `FilterBar`
Fields: Buy/Rent toggle · Location (select) · Property Type (select) · Price Range (min/max) · Bedrooms · Bathrooms · Search button.
Horizontal layout on the home page hero; vertical sidebar layout on the properties page. Same component, controlled by a `variant` prop.

### `PropertyGrid`
Responsive grid of `PropertyCard`: 1 column mobile, 2 tablet, 3 desktop. Handles empty state and loading skeletons.

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

1. Breadcrumb: Home / Properties / [Title]
2. **Image gallery** — large main image + thumbnail strip, click to open a lightbox
3. **Left column:**
   - Title, location, Buy/Rent badge
   - Price (large)
   - Key specs row: bedrooms, bathrooms, size, property type
   - Description
   - Amenities — grid of items with check icons
   - Map placeholder box
4. **Right column (sticky):**
   - Owner contact card: avatar, name, phone, email
   - "Buy Now" or "Rent Now" button (depending on `listingType`)
   - Inquiry form: name, email, phone, message, Send button
5. **Similar Properties** — `PropertyGrid` with 3 mock properties

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
