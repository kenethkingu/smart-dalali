# Proland — Claude Code Prompt (v2 — Booking Platform)

**This is v2** — the structure has changed from "click-through app only" to
a **full booking-style website** with a public homepage, three user roles,
and a "request site visit → pay → decline within 3 days" flow. v1
(Mpangaji/Dalali, two roles) has been superseded by this structure.

---

## 1. Context

Proland is a Tanzanian real estate website that works as a **booking
platform** (like Booking.com/Airbnb, but for property purchases/site
visits) — not a plain classifieds site. Anyone can browse listings without
an account; login is required **only** when someone wants to request a site
visit, pay, or list their own property.

Tech stack: React + Vite + TypeScript + Tailwind CSS. Unlike v1, this is now
a **real multi-page website** (Home, About, Properties, Property Detail,
Dashboards) — not just a mobile app-shell — so we use **react-router-dom**
(see Section 5).

## 2. Three user roles

| Role | UI label | What they do |
|---|---|---|
| `admin` | Admin | The platform's middleman — reviews and approves new listings before they go public (Pending → Approved/Rejected), manages all users, sees every site-visit request system-wide, resolves disputes. |
| `owner` | Property Owner | Uploads their properties + amenities (WiFi, parking, security, etc.), manages their listings, sees and responds to site-visit requests on their properties. |
| `buyer` | **Buyer** | Browses properties (no login needed), requests a site visit, pays (confirms payment), and can **decline their own site-visit request within 3 days of making it** — after that window, decline is no longer available. |

> **Why "Buyer"**: it's the term consistently used across real-estate
> booking platforms (Cal.com, TIMIFY, Bookafy, and YouCanBookMe all label
> this role "Buyer" in their buyer-tour-scheduling / buyer-consult flows).
> If renting gets added later, the name still works — "Buyer" can just mean
> "the person going through the process of securing a property," not
> necessarily an outright purchase.

## 3. Brand — logo & design tokens (replaces the v1 gradient system)

**The brand changed with this update.** Proland's logo (provided as a
reference image) is a minimal, monochrome geometric mark — not the
orange/teal gradient badge used in earlier drafts of this prompt. Discard
the gradient-badge treatment entirely and build to this instead:

### 3.1 The mark — build it as a real SVG component (`Logo.tsx`), not an image file

The logo has three stacked shapes, always rendered in a single flat color
(pure black on light backgrounds, pure white on dark backgrounds — **never
a gradient, never two-tone**):
1. A solid **triangle** (the roof), apex centered at the top, flat base.
2. A **rectangular notch cut out of the triangle's base**, centered,
   creating a "doorway/gap" negative-space between the roof and the shape
   below it. (Easiest implementation: draw the triangle, then overlay a
   rectangle in the page background color positioned at the triangle's
   base-center to punch out the gap — simpler than a compound SVG path,
   and works on any solid background.)
3. A **horizontal pill/rounded-bar** beneath the roof, shorter than the
   triangle's base width, centered, with a small gap between it and the
   roof above.

Below the mark: the wordmark **"PROLAND"** — bold, all-caps, wide letter
spacing (`tracking-[0.25em]` or similar), same flat black/white as the
mark. Build `<Logo />` with a `size` and `tone: 'dark' | 'light'` prop
(tone controls whether it renders black-on-transparent or white-on-
transparent) so it can sit on both the white navbar and any dark section
(e.g. the footer) without a separate asset.

### 3.2 Color tokens

Because the mark itself is strictly monochrome, keep the whole UI
disciplined around black/white/grey with **one** accent color doing all
the work (CTAs, links, success states, the "verified" signal) — resist the
temptation to reintroduce a multi-color palette; that's what the old
gradient system did and it now fights the logo.

```
--pl-ink:          #0B0B0C   /* primary text, the logo itself, headings */
--pl-white:        #FFFFFF
--pl-surface:       #F6F6F5   /* soft off-white for section backgrounds */
--pl-line:          #E5E5E4   /* hairline borders, dividers */
--pl-muted:         #6B6B6D   /* secondary text */
--pl-accent:        #16A97C   /* single accent — buttons, links, "approved"/"verified" */
--pl-accent-dark:   #0F8563   /* accent hover/active state */
--pl-danger:        #C0392B   /* Decline button, Reject in admin queue */
```

### 3.3 Typography

The wordmark's letterforms are a squared-off grotesk, not the rounded
geometric style Poppins has — **use Archivo** (free on Google Fonts,
weights 500/600/700/800) for headings, the logo wordmark, and buttons; it
reads much closer to the mark than Poppins does. Body copy can stay on
Archivo too (it has a readable regular weight) rather than mixing two
families — one typeface, disciplined weight usage, matches the minimal
brand better than a heading/body pairing here.

## 4. Setup

```bash
npm create vite@latest smart-dalali -- --template react-ts
cd smart-dalali
npm install
npm install lucide-react clsx tailwind-merge react-router-dom date-fns
npm install motion canvas-confetti
npm install -D @types/canvas-confetti tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init   # for Dialog/Drawer/Sheet/Select
```

`date-fns` is needed for the "3 days since request" countdown math (see
Section 9).

## 5. Routing (react-router-dom — a change from v1)

v1 used an internal navigation stack (no router) because it was a
click-through app-shell only. Now that there's a **public homepage with
real URLs** (SEO-friendly later, and people can share a link to a single
property), use real routes:

```
/                              — Homepage (public)
/about                          — About Us (public)
/properties                      — Property search/listing grid (public)
/properties/:id                   — Property detail (public)
/how-it-works                      — How it works (public, optional)
/login                              — Login/Register (modal OR page — see 5.1)
/buyer/dashboard                     — Buyer dashboard (protected: buyer)
/buyer/requests/:id                   — Single site-visit request detail (protected: buyer)
/owner/dashboard                       — Owner dashboard (protected: owner)
/owner/properties/new                   — List a new property (protected: owner)
/owner/properties/:id/edit               — Edit a property (protected: owner)
/owner/requests                           — Site-visit requests on their properties (protected: owner)
/admin/dashboard                           — Admin dashboard (protected: admin)
/admin/properties                           — Property approval queue (protected: admin)
/admin/users                                 — All users (protected: admin)
/admin/requests                               — All site-visit requests (protected: admin)
```

Use a `<ProtectedRoute role="buyer">` wrapper component that checks
`useAuth()` context — a user without the right role gets redirected to
`/login` with a `redirectTo` param, so after logging in they land back
where they were trying to go (e.g., they clicked "Request Site Visit"
without being logged in → sent to login → after login, sent straight back
to the property detail page with the request modal open).

### 5.1 When login appears — important

**Login is no longer the app's first screen.** The Homepage, About,
Properties, and Property Detail pages all load without an account. Login/
Register only appears **when** a specific action requires it:
- A buyer clicks "Request Site Visit" or "Pay/Confirm" on a property detail
  page
- Someone clicks "List Your Property" (becoming an owner)
- Someone tries to reach any `/buyer/*`, `/owner/*`, or `/admin/*` route
  without being logged in

Use a **login modal** (not a full-page redirect) for quick actions like
"Request Site Visit" — this reduces friction (the user doesn't lose the
property they were looking at). For "List Your Property" or reaching a
dashboard, a full-page `/login` is fine.

## 6. Folder structure

```
src/
  types/index.ts
  data/mockData.ts
  lib/
    utils.ts
    auth.tsx              — AuthContext (role, user, login/logout)
    dates.ts               — canDecline(), formatCountdown() helpers (date-fns)
  components/
    layout/
      Navbar.tsx            — public navbar (Section 7)
      Footer.tsx
      DashboardShell.tsx      — sidebar/shell for the three role dashboards
      ProtectedRoute.tsx
    shared/
      GradientThumb.tsx
      Bits.tsx                — VerifiedBadge, PropertyStatusBadge, Pill,
                                 PrimaryButton, etc. (carried over from v1)
      LoginModal.tsx
      CountdownBadge.tsx        — "You can decline for another 41 hours" etc.
    home/
      Hero.tsx                  — big search bar + background
      FeaturedProperties.tsx
      HowItWorks.tsx
      Testimonials.tsx           (optional)
    properties/
      PropertyCard.tsx
      PropertyGrid.tsx
      FiltersBar.tsx
      PropertyDetailPage.tsx
      RequestVisitModal.tsx
    buyer/
      BuyerDashboard.tsx
      VisitRequestCard.tsx        — has Decline (if within the 3-day window)
                                     + Confirm Payment
      PaymentConfirmScreen.tsx
    owner/
      OwnerDashboard.tsx
      PropertyForm.tsx             — upload property + amenities
      OwnerPropertyList.tsx
      OwnerRequestsList.tsx
    admin/
      AdminDashboard.tsx
      PendingPropertiesQueue.tsx     — approve/reject (formerly "Verified Badge")
      UsersTable.tsx
      AllRequestsTable.tsx
  pages/                            — one per route, composes the
                                      components above
  App.tsx                           — <BrowserRouter><AuthProvider><Routes>...
  main.tsx
```

Follow separation of concerns — one file per piece, don't merge logic from
different roles into a single component.

## 7. Homepage & Navbar (public) — structure from 2026 research

Research on the best real-estate websites of 2026 points to a structure
that consistently works: **keep the navbar to 5-7 top-level links**, and
give the "book a tour" CTA a dedicated, visible spot — never bury it in a
menu.

> **Named references** (study the pattern, don't copy the brand):
> **Zillow** for "the search bar owns the entire hero" discipline,
> **Redfin** for how trust/urgency badges should read at a glance,
> **Opendoor** for putting the trust stack directly below the hero as a
> real design element rather than a footer footnote — all three ideas are
> built into the sections below.

### Navbar (sticky, top)
```
[Proland Logo]   Home   About Us   Properties   How It Works
Contact                          [List Your Property]  [Log In / Sign Up]
```
- The two rightmost buttons are visually distinct: "List Your Property" is
  a `GhostButton`/outline (for owners), "Log In / Sign Up" is the
  `PrimaryButton` (green).
- Once logged in, "Log In / Sign Up" becomes an avatar + name + dropdown
  (Dashboard, Profile, Log Out).
- Mobile: hamburger menu, with the search bar staying visible (sticky)
  even on phones — a "sticky search/CTA bar" is a proven pattern for
  lifting conversion on mobile real-estate sites.

### Hero section (top of the homepage) — the Zillow pattern
Headline + **a large search bar** (location + property type + price) +
gradient/photo background. Sample headline: "Find the Home or Plot You
Want — Book a Visit, Pay Securely." Below the search bar: quick-filter
pills (Houses/Plots/Offices, Rent/Buy). The search bar should be *the*
dominant visual element of the hero — not a small input squeezed beside
the headline; on Zillow it effectively *is* the homepage's whole reason
for being above the fold, and Proland's hero should carry the same weight.

### Rest of the homepage (in order)
1. **Hero + Search** (top)
2. **Featured/Sponsored Properties** — a grid of 6-8 property cards (from
   `sponsored: true` in the mock data)
3. **How It Works** — 3 steps: Search → Request a Site Visit → Pay
   Securely, each with an icon + short description
4. **Why Proland** — the Opendoor-style trust stack, placed immediately
   below the hero/featured section, not buried near the footer: verified
   properties (every listing is reviewed by an Admin), site visit before
   payment, etc. — presented as its own visually distinct section with
   icons, not a paragraph of text.
5. **Owner CTA** — "Have a Property to Sell or Rent? List It Free" +
   a button leading to `/login` (owner signup)
6. **Footer** — About/Contact/Terms links, social icons, company name.
   (See 7.1 for the "other booking-website features" you asked about —
   they're covered here.)

### 7.1 "Other things related to booking websites" — extra elements
   confirmed by research (add as time allows, not all required for v1):
- **Sticky "Contact Us/Call" bar** on mobile (bottom of screen, matching
  what the leading real-estate sites do)
- **Neighborhood/area pages** (optional, later) — location pages (e.g.
  "Properties in Sinza") with average prices and available listings
- **Saved/Favorites** (heart icon) for logged-in buyers
- **Currency/Language switcher** (optional, decorative for now — TSh only
  is fine)
- **Embedded contact form** on the Contact Us page (name, phone, message)

## 8. Property Detail Page layout — the Compass/Sotheby's pattern

Don't build this as a single stacked column (image on top, text below,
the way v1's mobile mockups did it). 2026 research on luxury/high-
performing listing pages (Compass, Sotheby's) converges on a **split-panel
layout** for anything wider than a phone screen, because buyers need to
process photos and details *simultaneously*, not by scrolling past one to
reach the other:

- **Left panel (~60% width on desktop)**: the photo gallery — a large
  primary image with a thumbnail strip/dot indicator below it, swipeable.
- **Right panel (~40% width), sticky while the left panel scrolls**:
  title, location, price, the amenities list, the description, the
  owner/agent card, and **three** actions — **"Request Site Visit"**
  (primary), **"Pay / Confirm Purchase"** (secondary), and a smaller
  **WhatsApp icon button** (see 8.1) for a quick question before
  committing to either of those. This panel stays pinned in the
  viewport (`position: sticky; top: <navbar height>`) as the user scrolls
  the gallery or reads a long description, so none of the three is ever
  scrolled out of reach.
- **Below both panels, full width**: a map pin (approximate location) and
  a "Similar Properties" row.
- **On mobile**: collapses to a single column, gallery first, then the
  detail panel — but the three actions become a **sticky bottom bar**
  (fixed to the viewport bottom) instead of sticky-top, so they're always
  reachable without a fixed side panel to pin them to.

This directly replaces whatever `PropertyDetailPage.tsx` layout you'd
default to — build it split-panel from the start rather than stacked.

### 8.1 WhatsApp quick contact

Confirmed relevant, not just a nice-to-have: WhatsApp is the dominant
contact channel in this market (already established back in the original
competitor research, and visible again on the wanachuo.com reference you
shared — floating WhatsApp button, present on every screen). Add it in
two places:

- **On the Property Detail page**: a WhatsApp icon button (green, brand-
  recognizable icon, not a generic chat bubble) next to the two main CTAs
  in the sticky panel — opens `https://wa.me/<ownerPhone>?text=<encoded
  message>` in a new tab, where the pre-filled message is generated, not
  typed by the user, e.g.: *"Hi, I'm interested in [Property Title] on
  Proland (proland.app/properties/p1) — is it still available?"* Pulling
  in the actual title and a link means the owner immediately knows which
  property, without the buyer having to explain it.
- **Sitewide floating button** (bottom-right, all public pages): a
  general "Chat with us" WhatsApp button routing to Proland's own support
  number rather than any specific owner — for buyers with a question
  before they've even found a property. Keep this one visually minimal
  (small circular button, no notification badge/dot by default — the
  wanachuo.com reference has a persistent red badge on it at all times,
  which trains users to ignore badges as noise; only show a badge if
  there's an actual unread reply waiting).

This means `Property.agent` needs a phone number — see the updated type
in Section 10.

## 9. Site Visit Booking — state machine (this is the new core piece)

### 8.1 Types

```ts
type VisitStatus = 'pending' | 'declined' | 'payment_confirmed'

interface SiteVisitRequest {
  id: string
  propertyId: string
  buyerId: string
  requestedAt: string   // ISO date — the 3-day countdown starts here
  status: VisitStatus
  visitDate?: string     // date the owner scheduled for the visit (optional)
  declinedAt?: string
  paymentConfirmedAt?: string
}
```

### 8.2 The rule (business rule — write it as one function, reuse it everywhere)

```ts
// lib/dates.ts
import { differenceInHours } from 'date-fns'

const DECLINE_WINDOW_HOURS = 72 // 3 days

export function canDecline(request: SiteVisitRequest): boolean {
  if (request.status !== 'pending') return false
  return differenceInHours(new Date(), new Date(request.requestedAt)) < DECLINE_WINDOW_HOURS
}

export function hoursLeftToDecline(request: SiteVisitRequest): number {
  const elapsed = differenceInHours(new Date(), new Date(request.requestedAt))
  return Math.max(0, DECLINE_WINDOW_HOURS - elapsed)
}
```

> **Important note (not a legal claim)**: this 3-day window structurally
> resembles the "cooling-off period" concept used in some commercial
> contracts — but this is a **product business rule** we're choosing
> ourselves, not a real-estate legal requirement (real-estate law often
> does *not* carry an automatic cooling-off period, unlike door-to-door
> sales). Don't present it to users as "your legal right" — present it as
> Proland's policy.

### 8.3 UI flow

1. On the Property Detail page, a buyer clicks **"Request Site Visit"** →
   `RequestVisitModal` opens (if not logged in, `LoginModal` first) → picks
   a preferred date → a new `SiteVisitRequest` is created with
   `status: 'pending'`, `requestedAt: now`.
2. The Owner (or Admin) sees the request in `OwnerRequestsList` /
   `AllRequestsTable` and can set the agreed `visitDate` (optional for v1
   — doesn't have to change the status).
3. The buyer sees their request on `BuyerDashboard` as a `VisitRequestCard`
   showing:
   - If `canDecline(request)` is true: a `CountdownBadge` showing "You can
     decline for another 41 hours" (live-updating) + two buttons:
     **"Decline"** (red/outline) and **"Confirm Payment"** (green).
   - If `canDecline(request)` is false and status is still `pending`: the
     badge switches to "Cancellation window closed" (grey), the Decline
     button disappears/becomes disabled with a tooltip, and only
     **"Confirm Payment"** remains active.
   - If status is `payment_confirmed`: the card shows a VerifiedBadge-style
     "Confirmed" state + payment details.
   - If status is `declined`: the card turns grey/muted, "You declined this
     request" + the date.
4. **Confirm Payment** → `PaymentConfirmScreen` (mocked — simulate only for
   this prototype, no real payment gateway yet) → a success state with a
   small confetti burst (see Section 12).

## 10. Property data model (updated)

```ts
type PropertyStatus = 'pending' | 'approved' | 'rejected'

interface Property {
  id: string
  ownerId: string
  title: string
  location: string
  price: number
  priceUnit: 'month' | 'total'
  purpose: 'rent' | 'sale'
  type: 'house' | 'plot' | 'office'
  bedrooms?: number
  areaSqm?: number
  amenities: string[]        // e.g. ['WiFi', 'Parking', '24/7 Security', 'Reliable Water']
  status: PropertyStatus      // admin moderation — this is the old Verified Badge
  sponsored?: boolean
  description: string
  tone: 'a' | 'b' | 'c' | 'd' | 'e'
  agent: { name: string; phone: string; verified: boolean; rating: number }
  lat: number
  lng: number
}
```

A new property from an Owner starts as `status: 'pending'` — **it does not
appear on the public `/properties` page until an Admin approves it**
(`approved`). This formalizes v1's Verified Badge concept — it's now a
required Admin task rather than an optional broker request.

The `amenities` list should be checkboxes on `PropertyForm` (e.g. WiFi,
Parking, 24/7 Security, Reliable Water, Generator Backup, Swimming Pool,
Modern Kitchen, Ensuite Bathroom, Elevator, Balcony) — the Owner selects
which apply.

## 11. Monetization philosophy (still applies, slightly adjusted)

The Buyer doesn't pay to use the app (browsing and requesting a site visit
are free) — they only pay once they confirm an actual purchase/rental
(Confirm Payment), and that's payment for the property itself, not an app
fee (a commission can be layered in later). The **Owner** is the one who
pays to keep using the platform (Bronze/Silver/Gold tiers as in v1 —
Bronze stays free forever, Silver/Gold are priced low on purpose so they
don't choke growth). The **Admin** doesn't generate direct revenue — it's
an operating cost of guaranteeing quality.

## 12. Animations & Transitions — "insane," everywhere, but earned

This section got a lot bigger on request: **every heading, every card, and
every meaningful state change should move.** That's the brief. The
research below (GSAP's own docs, Awwwards technique breakdowns, and
several 2026 CSS/animation pattern libraries) backs up *how* to do that
without it turning into noise — the sites that do this well follow a
small number of disciplined patterns everywhere, rather than a different
gimmick per section. Follow the same approach: pick from the menus below,
apply them **consistently** by element type (all headings behave the same
way, all property cards behave the same way), not a new idea per screen.

### 12.1 Stack (unchanged core, one addition)

**`motion`** (micro-interactions/gestures/layout), native **View
Transitions API** (screen-to-screen, card→detail morphs), **GSAP +
ScrollTrigger** (scroll-driven sequences — now central, not optional,
given how much of this section leans on scroll), **Lenis** (smooth
scroll), `canvas-confetti` (payment-success moment).

**Addition: GSAP SplitText + ScrambleText.** As of GSAP 3.13 these are
**completely free** (no Club GSAP membership needed, unlike in past
years) — this is what makes the text-animation menu below possible
without paying for a plugin license:
```bash
npm install gsap
```
`SplitText` and `ScrambleText` are both included in the base `gsap`
package now — no separate install.

### 12.2 Core rules (unchanged, still non-negotiable)

`transform`/`opacity` only for anything frequent (60fps); consistent
timing per element type (150-200ms micro-interactions, 300-400ms screen
transitions, 40-60ms stagger steps); spring physics for anything
touchable/draggable, `ease-out` for things that just enter;
`prefers-reduced-motion` respected everywhere — wrap continuous/large
motion in `useReducedMotion()` and fall back to instant.

### 12.3 Text animation patterns — the menu, and where each one goes

Don't invent new text effects per page — assign each **type** of text on
the site to exactly one pattern, and use it every time that type of text
appears.

| Text type | Pattern | Where |
|---|---|---|
| Page/section headlines (`<h1>`, `<h2>`) | **Character or word stagger reveal** via GSAP `SplitText` + `ScrollTrigger` — splits into chars/words, each fades+slides up with a ~15-25ms stagger as the heading scrolls into view | Hero headline, every section title (Featured Properties, How It Works, Why Proland), dashboard page titles |
| Big numbers (price, stats) | **Count-up** from 0 to the real value, plus a **digit-flip** on the ones place if it updates live | Property price on cards/detail, Dashboard stats ("246 Contacts"), CountdownBadge hours |
| Price specifically on the Property Detail sticky panel | Count-up **on mount only** (not on every scroll) so it reads as a "reveal," not a distraction while browsing | Property Detail right panel |
| Body/description paragraphs | **Line-level reveal** (mask/clip-path uncover per line, not per character — per-character on paragraphs is unreadable and slow) via `SplitText` `type: 'lines'` | Property description, About Us page copy |
| Trust/verification copy | Subtle **word-by-word opacity ramp** (no movement, just an opacity stagger) — this is a "sincere" pattern, not a flashy one, appropriate for reading as credible rather than gimmicky | "Why Proland" trust section |
| Nav links, buttons, pills | **No entrance animation** on the text itself — only the container (button) gets a simple hover/press micro-interaction (scale, color — per the core rules in 12.2). Splitting/animating every nav link's letters is the "too much" failure mode — restraint here is what makes the big moments (headlines, cards) still read as special | Navbar, all pill/button labels |
| Empty states / errors | **`ScrambleText`** resolving into the real message over ~400ms (characters cycle randomly then settle) — reserved for these specific low-frequency moments so it stays a surprise, not wallpaper | "No properties match your filters," form validation messages |

**Progressive-enhancement note**: for text reveals that only need to fire
once on scroll-into-view (not scrubbed to scroll position), prefer the
**native CSS `animation-timeline: view()`** over GSAP where practical —
zero JS, zero bundle cost, and Baseline-supported in Chrome/Edge now with
Safari/Firefox catching up. Reserve GSAP `ScrollTrigger` for anything that
needs to be *scrubbed* (tied continuously to scroll position, like the
hero parallax) rather than a one-shot reveal.

### 12.4 Card animation patterns — the menu, and where each one goes

Same discipline: one card "personality" per card type, used everywhere
that type appears.

| Card type | Pattern | Notes |
|---|---|---|
| **Property cards** (grid/list) | Pointer-driven **3D tilt** (subtle — max ±6°, not a novelty tilt) that follows the cursor, `box-shadow` elevation deepens on hover, image does a slow `scale(1.04)` zoom inside its clipped container. Implementation: a few lines of vanilla JS on `mousemove` writing `--rx`/`--ry` custom properties, all actual rendering stays in CSS `transform` (GPU, no React re-render per frame) | This is the highest-frequency card on the site — restraint matters most here. Keep the tilt subtle; this is a listings site, not a trading-card demo |
| **Property grid, sibling de-emphasis** | On hover of one card, **dim the others to ~60% opacity** via a CSS `:has()` selector on the grid container (no JS) | Makes the hovered card feel "selected" without needing a click — cheap and effective at grid scale |
| **Featured/Sponsored property cards** | Everything Property cards get, **plus** a slow-looping subtle gradient-border shimmer (`@property` animated conic-gradient border, ~4s loop) to differentiate "sponsored" inventory at a glance without shouting | Featured Properties homepage section |
| **"Why Proland" trust cards** | Simple **lift + shadow deepen** on hover only (no tilt, no glow) — these are credibility content, an overly flashy hover here undercuts the trust message | Why Proland section |
| **Subscription/plan cards** (Owner's Bronze/Silver/Gold) | The non-hovered cards **dim slightly** whenever one is hovered/selected (the classic pricing-table steering pattern), and the selected/"Popular" card gets a `scale(1.02)` + accent-color glow that's always-on (not just on hover), pulsing very slowly | Owner subscription page |
| **Admin PendingPropertiesQueue cards** | Swipe-to-decide (already specified) **plus** a resting-state subtle rotation of ~-1.5deg alternating with the next card at +1.5deg, like a loose stack of physical photos — reinforces "this is a queue to work through" | Admin review queue |
| **Dashboard stat cards** | No hover effect (these aren't interactive) — instead, a **mount-time count-up + a single soft pulse** when the underlying number changes (e.g. a new site-visit request arrives) | Buyer/Owner/Admin dashboards |

**Elevation, done properly**: whenever a card "lifts" (hover, drag), don't
animate a single `box-shadow` value — layer two shadows (a tight ambient
shadow always present, plus a softer, larger directional shadow that
grows on hover) so the lift reads as physically real rather than a flat
opacity change on one shadow.

### 12.5 Previously specified, still standing (booking flow & homepage)

- **Hero** — headline + search bar staggered entrance (now via the
  text-stagger pattern in 12.3); background parallax via ScrollTrigger
  `scrub`.
- **Navbar** — frosted-glass background + shadow after ~40px scroll.
- **CountdownBadge** — minute-tick flip + green→orange color shift as the
  decline window closes (now formalized as the "digit-flip" pattern in
  12.3's number row).
- **Decline button** — fades and relabels to "Window Closed" rather than
  vanishing.
- **Admin approve/reject queue** — Tinder-style swipe, `layout` animation
  backfilling the gap (now paired with the resting-stack rotation from
  12.4).
- **Payment Confirm success** — confetti burst (particleCount: 50) +
  self-drawing SVG checkmark (`stroke-dashoffset`) + navigate after ~1.5s.

## 13. Quality bar

- Fully responsive: the homepage/property grid is desktop-first now (not
  just a mobile app-shell like v1) — but it must still work well on phones
  (that's how most Tanzanians actually reach the internet).
- Animation is a signature feature (Section 12) — every one has a reason.
- **Named anti-pattern to avoid — one logo, one accent color, everywhere.**
  A direct competitor reference (wanachuo.com) uses a different logo mark
  on its homepage than on its own sign-in page, and runs four unrelated
  accent treatments at once (a purple-orange gradient logo, the same
  gradient repeated on buttons, a separate yellow highlight word in the
  hero, and yet another blue on card buttons). That's the visual
  incoherence Proland is explicitly positioned against — the single
  `<Logo />` component (Section 3.1) and the single `--pl-accent` green
  (Section 3.2) are used *everywhere* something needs emphasis. If a
  screen seems to need a second accent color to feel "finished," that's a
  sign to adjust spacing/type hierarchy instead, not to add a color.
- Avoid generic AI-slop (default purple gradients, meaningless eyebrow
  labels, excessive emoji) — same failure mode as above, different cause.
- `canDecline()` and the countdown math should live in exactly one place
  (`lib/dates.ts`) — never duplicate the "3 days" logic across different
  components (single source of truth).
- A property with `status !== 'approved'` must never appear anywhere on
  public routes — even via a direct link.
- For anything genuinely ambiguous, make a sensible call and keep moving.

## 14. GitHub repo & Vercel deployment

**Repository (already created, currently empty):**
`https://github.com/kenethkingu/smart-dalali`

> Note: the repo slug is still `smart-dalali` from before the rename to
> **Proland**. That's fine to keep as-is (renaming a GitHub repo later is
> a one-click Settings action and doesn't break the existing remote URL —
> GitHub auto-redirects the old URL), so there's no need to create a new
> repo just for the name change. Use `Proland` for the product name,
> package name (`package.json` → `"name": "proland"`), and everywhere in
> the UI; leave the repo URL as `smart-dalali` unless told otherwise.

### 13.1 Push the scaffolded project

After running the setup in Section 4 and building out the folder structure
from Section 6, initialize git and push to the existing repo:

```bash
git init
git add -A
git commit -m "Initial commit — Proland booking platform scaffold"
git branch -M main
git remote add origin https://github.com/kenethkingu/smart-dalali.git
git push -u origin main
```

Confirm the Vite scaffold's `.gitignore` already excludes `node_modules`,
`dist`, and `.env*` before the first commit — don't commit build output or
dependencies.

Use normal feature-branch hygiene from here on (`git checkout -b
feature/buyer-dashboard`, etc.) rather than committing everything straight
to `main`, even solo — it keeps history readable once this moves past
prototype stage.

### 13.2 Vercel deployment (client-side routing needs one config file)

Because Section 5 uses `react-router-dom` with real routes
(`/properties/:id`, `/buyer/dashboard`, etc.), Vercel needs to be told to
serve `index.html` for every path — otherwise a direct visit or refresh on
a sub-route (e.g. sharing a link to `/properties/12`) 404s. Add this file
at the project root:

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Deployment steps:
1. Push the repo to GitHub (14.1) — Vercel deploys straight from GitHub.
2. Go to vercel.com → **New Project** → **Import Git Repository** → select
   `kenethkingu/smart-dalali`.
3. Framework Preset: **Vite** (auto-detected from `package.json`).
4. Build Command: `npm run build` (default — leave as is).
5. Output Directory: `dist` (default for Vite — leave as is).
6. No environment variables are needed yet (this is a mock-data prototype
   with no backend/API keys). Add an `Environment Variables` section in the
   Vercel dashboard later once a real API is wired up.
7. Click **Deploy**. Every subsequent push to `main` auto-deploys; pushes
   to other branches get their own preview URL — useful for sharing a
   specific feature (e.g. the admin swipe-queue) before merging.

After the first deploy, verify the `vercel.json` rewrite actually works by
opening a deep link directly (e.g. `your-app.vercel.app/properties/p1`) in
a fresh tab, not just by clicking through from the homepage — that's the
case a missing rewrite silently breaks.
