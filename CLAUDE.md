# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ⚠️ Next.js 16 is not the Next.js in your training data

`next@16.2.11` + `react@19`. APIs and conventions differ from older versions. **Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code** (see `01-app`, `03-architecture`). This is not optional — heed deprecation notices there.

One consequence already load-bearing in this repo: **`searchParams` and `params` are `Promise`s** that must be `await`ed in async page components (see [app/properties/page.tsx](app/properties/page.tsx)).

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also the type/route check)
npm run start    # serve the production build
npm run lint     # eslint (flat config: eslint.config.mjs)
```

There is **no test runner** configured. Do not invent test commands; verify changes with `npm run build` and `npm run lint`.

## Project phase (drives every decision)

This is a phased build defined by [PRD.md](PRD.md) and [PRD-FRONTEND.md](PRD-FRONTEND.md). **Currently Phase 1: frontend with mock data only** — no database, no API routes, no auth logic.

- All data comes from [lib/mock-data.ts](lib/mock-data.ts). Form submissions (auth, inquiry, property, contact) **`console.log` the payload and show a success state** — they do not persist anything. Follow that pattern; don't wire up real backends unless the phase has moved on.
- Every mock object must match the types in [types/index.ts](types/index.ts) exactly. Those types are the **frontend/backend contract** — the future backend must satisfy them, so change them deliberately.
- Out-of-scope features (payments, chat, agent profiles, i18n, admin panel, reviews) are excluded by the PRD. Don't add them.

## Keep the PRDs in sync — every change

[PRD.md](PRD.md) and [PRD-FRONTEND.md](PRD-FRONTEND.md) are the source of truth, not a historical record. **Whenever a change makes them inaccurate, update them in the same turn as the code** — do not leave it for later or ask whether to bother. Report what you updated alongside the code change.

What lands in which file:

- **[PRD.md](PRD.md)** — anything touching the shared contract or the shape of the product: a change to [types/index.ts](types/index.ts) (mirror it into §6 verbatim), a new/removed/renamed route (§7), a scope decision in or out (§4), a phase transition (§8).
- **[PRD-FRONTEND.md](PRD-FRONTEND.md)** — anything about how Phase 1 is built: a new or renamed component or `lib/` module (§2 folder structure), a change to a shared component's props or behavior (§3), a page's sections/layout/interactions (§4.x), mock-data shape or counts (§5), build-order progress (§6).

Rules of thumb:

- A **new component, hook, or `lib/` module** → add it to the §2 tree, and to §3 if it's shared across pages.
- A **deliberate divergence** from a spec (a layout that reads better, a dropped sub-feature) → rewrite the spec to match what was built. Never let code and PRD disagree silently; if the divergence is worth questioning, make the edit *and* flag it.
- A **type change** → PRD.md §6 and `types/index.ts` must stay character-identical.
- **Match the existing voice**: terse, present tense, backtick-quoted identifiers, relative markdown links to real files. Edit the affected lines surgically — do not restructure or reformat sections that didn't change.
- Renaming, moving, or deleting a file means fixing **every** PRD reference to it, in both files.

Purely internal edits that change nothing a PRD asserts (a refactor behind stable props, a bugfix, a copy tweak) need no PRD edit.

## Architecture

**App Router, Server Components by default.** Pages under [app/](app/) are async Server Components that read `mock-data`, compute, and pass plain data down. Add `"use client"` only where interactivity requires it (forms, filter state, drawers, motion).

**URL is the filter state — no global store.** The filtering flow is the central pattern to understand:
- [components/property/FilterBar.tsx](components/property/FilterBar.tsx) (client) holds local input state and on submit `router.push`es a query string.
- [app/properties/page.tsx](app/properties/page.tsx) (server) awaits `searchParams`, then [lib/property-filters.ts](lib/property-filters.ts) `parsePropertyFilters` → `filterProperties` produces the sorted result set server-side.
- New filters/sorts go through `lib/property-filters.ts`, not ad-hoc filtering in components.

**Formatting and pure logic live in `lib/`, not components.** Prices, sizes, dates, property-type/amenity labels → [lib/format.ts](lib/format.ts). Email check → [lib/validation.ts](lib/validation.ts). Location list → [lib/locations.ts](lib/locations.ts). Reuse these instead of re-deriving.

**Component layout** (per PRD folder structure): `components/layout/` (Header, Footer, Container), `components/property/`, `components/home/`, `components/forms/`, `components/ui/`. Root layout [app/layout.tsx](app/layout.tsx) wraps every page in Header + `<main>` + Footer.

## UI conventions

- **shadcn/ui here is built on `@base-ui/react`, NOT Radix.** Style is `base-nova` ([components.json](components.json)). Primitives have a different API from the Radix-based shadcn you may know — e.g. `Button` takes a `render` prop and `nativeButton` (see [components/ui/button.tsx](components/ui/button.tsx)). Check the existing `components/ui/*` file before assuming a prop exists.
- **Tailwind v4**, configured entirely in CSS via `@import` + `@theme` in [app/globals.css](app/globals.css) — there is no `tailwind.config.js`. Use semantic theme tokens (`bg-card`, `text-muted-foreground`, `ring-border`, `text-primary`), not raw colors.
- Merge classes with `cn()` from [lib/utils.ts](lib/utils.ts). Icons from `lucide-react`. Path alias `@/*` maps to the repo root.
- Animations use `framer-motion` with the shared variants/easing in [lib/motion.ts](lib/motion.ts) — reuse `fadeUp`, `scaleIn`, `stagger`, `viewportOnce` rather than defining new ones inline.
- Forms follow the [InquiryForm](components/property/InquiryForm.tsx) pattern: local `values`/`errors` state, a `validate()` gate, `noValidate` on the `<form>`, and `FormField` + `formInputClass` from [components/ui/form-field.tsx](components/ui/form-field.tsx).
- Images use `next/image` with `picsum.photos` placeholders.

## Working style (from PRD §9)

Build **one page/feature at a time**; reuse shared components (`FeaturedPropertyCard`, `PropertyGrid`, `FilterBar`) instead of duplicating markup; keep components small and fully typed.
