# CLAUDE.md — Daguet Antique

## Project overview

Website for Christophe Daguet, an ébéniste (cabinetmaker), designer, and antique dealer. The site is a portfolio/catalogue showcasing his antiques (mostly 20th century furniture) and his own creations. No e-commerce — inquiries via contact form, payments handled offline.

## Tech stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- **CMS:** Strapi v5 (headless), PostgreSQL, Cloudinary for media
- **Deployment:** Vercel (frontend), Railway or Render (Strapi)
- **Language:** French-only UI. Code and comments in English.

## Project structure

```
daguet-antique/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/
│   │   ├── lib/       # API client, types, utils
│   │   └── styles/    # globals.css
│   ├── public/
│   ├── tailwind.config.ts
│   └── next.config.ts
├── cms/               # Strapi project
│   ├── src/
│   │   ├── api/       # Content types
│   │   └── plugins/
│   └── config/
├── docs/              # Specifications, tickets, guides
│   ├── specs.md
│   ├── tickets.md
│   └── guide-christophe.md
└── CLAUDE.md
```

## Key commands

```bash
# Frontend
cd frontend && npm run dev          # Dev server on :3000
cd frontend && npm run build        # Production build
cd frontend && npm run lint         # ESLint

# CMS
cd cms && npm run develop           # Strapi dev on :1337
cd cms && npm run build             # Strapi production build
cd cms && npm run strapi generate   # Generate content type
```

## Architecture decisions

### Data fetching
- Use server components by default. Client components only for interactivity (filters, lightbox, mobile menu, forms).
- ISR with `revalidate: 60` for catalogue pages. `revalidate: 3600` for static pages.
- Strapi webhook triggers on-demand revalidation via `/api/revalidate` route handler.
- All Strapi API calls go through `lib/strapi.ts` — never call fetch directly in components.

### Strapi content types
- `piece` (collection): title, slug, description (rich text / blocks), photos (media multiple), category (enum: antiquite|creation), subcategory (relation), period, materials, dimensions, provenance, price (decimal, nullable), show_price (boolean), sale_status (enum: available|sold — renamed from `status` to avoid Strapi v5 reserved field conflict), work_in_progress (boolean), featured (boolean)
- `subcategory` (collection): name, slug, category (enum: antiquite|creation), order (number)
- `homepage` (single type): hero_image, hero_title, hero_subtitle, intro_text, intro_image
- `about-page` (single type): title, portrait_image, biography (rich text), atelier_images, atelier_description
- `contact-page` (single type): address, phone, email, google_maps_embed, social_instagram, social_facebook
- `site-setting` (single type): site_name, logo, footer_text

### Routing
```
/                       → Homepage
/antiquites             → Antiques catalogue
/antiquites/[slug]      → Antique piece detail
/travaux                → Creations catalogue
/travaux/[slug]         → Creation detail
/a-propos               → About page
/contact                → Contact page
/mentions-legales       → Legal notices
/api/revalidate         → Webhook endpoint for Strapi
/api/contact            → Contact form submission handler
```

### Styling rules
- Tailwind CSS only — no CSS modules, no styled-components.
- Color palette defined as CSS variables in globals.css AND in tailwind.config.ts `extend.colors`.
- Typography: serif for headings (`Cormorant Garamond` or `EB Garamond`), sans-serif for body (`DM Sans` or `Outfit`). Load via `next/font/google`.
- Background: off-white `#FAFAF8`. Text: near-black `#1A1A1A`. Accent: `#2C2C2C`. Sold badge: warm bronze `#C4A77D`.
- Mobile-first. Breakpoints: sm (640), md (768), lg (1024), xl (1280).
- Generous whitespace. Let the photos breathe.

### Component conventions
- One component per file. Named exports.
- Props interface defined in the same file (or in `lib/types.ts` for shared types).
- Server components: no `"use client"` directive. Fetch data directly.
- Client components: minimal — only for interactive elements. Mark with `"use client"`.
- Framer Motion: use for page transitions, scroll reveal (fade-in + translate-y), image hover (scale), mobile menu (slide).

### Image handling
- All piece photos served from Strapi/Cloudinary.
- Use `next/image` with Cloudinary or Strapi URL in `next.config.ts` `images.remotePatterns`.
- Piece cards: aspect ratio 4:5, `object-fit: cover`.
- Hero: full-width, `priority` prop for LCP.
- Lightbox: client component, loads full-res on demand.

### Forms
- Contact form: client component with React state. POST to `/api/contact` route handler.
- Route handler forwards to Strapi or sends email directly via Resend/SendGrid.
- Client-side validation + server-side validation. No form libraries needed (simple form).

### Error handling
- `error.tsx` at app root for global error boundary.
- `not-found.tsx` for 404 pages.
- Strapi API errors: catch in `lib/strapi.ts`, return null/empty array, components handle gracefully.

## Testing strategy

- **Build test:** `npm run build` must pass with zero errors on every ticket.
- **Type check:** `npx tsc --noEmit` must pass.
- **Lint:** `npm run lint` must pass.
- **Visual:** manual check in browser at 3 breakpoints (mobile 375px, tablet 768px, desktop 1440px).
- **Lighthouse:** target 90+ on Performance, Accessibility, Best Practices, SEO.
- **Strapi:** verify each content type via admin UI (create, read, update, delete a test entry).

## Environment variables

```
# Frontend (.env.local)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337   # Dev
STRAPI_API_TOKEN=                               # Generated in Strapi admin
REVALIDATION_SECRET=                            # Shared secret for webhook
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # For sitemap/SEO

# CMS (.env)
DATABASE_URL=                                    # PostgreSQL connection string
APP_KEYS=                                        # Strapi app keys
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
JWT_SECRET=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
FRONTEND_URL=http://localhost:3000
REVALIDATION_SECRET=                            # Must match frontend
```

## Current status

Project is in initial setup phase. See `docs/tickets.md` for the full implementation plan with atomic tickets.

## Mock data note

For initial development, use mock/placeholder data:
- Contact info: fictional address, phone, email
- Piece photos: placeholder images from Unsplash (furniture/antique categories)
- Prices: random realistic prices (€200 — €5,000 range)
- Biography: lorem ipsum or placeholder French text
- Legal notices: generic French mentions légales template
- Instagram: @daguet_antique (real account, may not have content yet)

Replace all mock data with real content before production deployment.
