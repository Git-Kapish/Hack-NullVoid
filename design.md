# ShopSmart AI — Design Specification (design.md)

**Status:** Draft for hackathon implementation
**Version:** 1.0
**Date:** 2026-10-23
**Companion document:** `PRD.md` v1.2 (React 19 + Vite frontend, FastAPI backend)
**Reference site:** https://wrapper.framer.ai/ (Framer "Enterprise Agents Website Template")

---

## 1. Purpose and Scope

This document defines how the ShopSmart AI frontend should look, behave, and read. It turns the screens and UI principles in PRD Section 14 into concrete layouts, components, tokens, and states, so that frontend work can proceed in parallel with backend work.

It covers:
- Reference-site takeaways (Section 1.1), design principles (Section 2), and information architecture (Section 3).
- Visual tokens including motion (Section 4), layout and responsiveness (Section 5), and components (Section 6).
- Screen-by-screen specifications mapped to PRD requirements (Section 7).
- AI-specific UI patterns: recommendations, grounded answers, abstention, and tool actions (Section 8).
- States, accessibility, microcopy, theming, and formatting (Sections 9–13).
- Frontend implementation notes, build order, and open questions (Sections 14–16).

Priority labels match the PRD: **P0** = required for the demo, **P1** = if time permits, **P2** = defer.

### 1.1 What was and was not taken from the reference site

The reference page was read as text only. Its text reveals structure and copy tone, but not CSS values, so **no colors, fonts, or sizes were extracted from it**. Every token in Section 4 is a proposal made for this project. If you want a closer visual match, send screenshots of the reference or the exact colors and fonts you like, and Section 4 can be updated in one pass.

What the reference does show, and what we adapt:

| Reference pattern | How ShopSmart AI uses it |
|---|---|
| Top navigation with logo, a few links, a "Log in" action | Same shape: logo, Shop, Compare, Ask AI, Policies, cart/wishlist icons, account menu |
| Hero with a short headline, a subhead, a primary and a secondary action, and a product mockup | Home hero with "Shop now" and "Ask ShopSmart AI", plus a real-looking chat mockup |
| A chat-app mockup with sidebar and model selector | Inspires the AI assistant layout (conversation list optional, composer at the bottom) |
| "Answers that show their work" feature block | Directly maps to RAG answers with source title, section, and version |
| Logo strip ("trusted by…") | Brand strip of catalog brands |
| Short, benefit-led feature sections | Three feature sections on Home: grounded recommendations, policy answers with sources, order tracking |
| FAQ section | Policy FAQ on Home, populated only from seeded, approved documents |
| Testimonial cards | Optional product review cards on product detail (P2) |
| Footer with link columns | Footer with Shop, Help, Account columns |
| Confident, punchy copy | Adopted for headlines. Body and AI copy stay precise and plain (Section 13) |

**Do not copy** the template's text, imagery, logos, customer names, or its comic-book/Gotham theme. Use it only as structural inspiration.

---

## 2. Design Principles

1. **Grounded, not magical.** Anything the AI says is visibly separate from the facts the system owns. Prices, stock, order status, and policy sources come from the backend and are rendered from API data, never from AI-generated text.
2. **Show the work.** Every recommendation has a reason. Every policy answer has a source (document, section, version) and a confidence level.
3. **Honest when unsure.** If evidence is missing, the UI says so plainly and offers a next step. It never fills the gap with a confident-looking guess.
4. **Shopping first, AI second.** The catalog, cart, and orders must work well with no AI at all. If the AI provider is down, only the AI panels degrade (PRD Section 12).
5. **Scannable.** Dense information (specs, policy text, shipment events) is structured for quick reading: comparison tables, timelines, labeled badges.
6. **Accessible and responsive by default.** WCAG 2.2 AA is the baseline, and every screen works from 360 px wide to desktop.
7. **Calm visuals.** Neutral surfaces, one primary accent, and a distinct secondary accent reserved for AI content. Color carries meaning, so it is used sparingly.

---

## 3. Information Architecture

### 3.1 Route map

| Route | Screen | Access | Priority |
|---|---|---|---|
| `/` | Home | Public (see note) | P0 |
| `/login` | Login | Public | P0 |
| `/products` | Catalog | Authenticated | P0 |
| `/products/:id` | Product detail | Authenticated | P0 |
| `/compare` | Product comparison | Authenticated | P0 |
| `/cart` | Cart | Customer | P0 |
| `/wishlist` | Wishlist | Customer | P0 |
| `/assistant` | AI shopping assistant | Customer | P0 |
| `/policies` | Policy Q&A (knowledge assistant) | Customer | P0 |
| `/orders` | Orders list | Customer | P0 |
| `/orders/:id` | Order detail and shipment timeline | Customer | P0 |
| `/support` | Support tickets (list and create) | Customer | P0 |
| `/account/preferences` | Preferences | Customer | P0 |
| `/admin/products` | Product management | Admin | P0 |
| `/admin/knowledge` | Document upload and versions | Admin | P0 |
| `/admin/audit` | Audit events and AI decisions | Admin | P0 |

**Note on public vs authenticated:** the PRD protects all API routes except an explicit allowlist and says catalog access is authenticated by default. If the team decides to make catalog browsing public, add `GET /products`, `GET /products/{id}`, and `GET /categories` to the allowlist. Until then, Home is a public marketing page and the catalog redirects unauthenticated users to `/login`.

### 3.2 Navigation

**Top bar (all authenticated screens):** logo, Shop, Compare, Ask AI, Policies, search field, wishlist icon, cart icon with item count, account menu (Preferences, Orders, Support, Log out).

**Admin:** admins see an additional "Admin" menu (Products, Knowledge, Audit). Role-based navigation is for convenience only. The backend remains the enforcement point (PRD Section 5).

**Mobile:** top bar collapses to logo, search icon, cart icon, and a menu button that opens a full-height drawer containing the remaining links.

---

## 4. Visual Language (Proposed Tokens)

### 4.1 Color

Light theme is P0. Dark theme is P1; tokens are defined now so components are built theme-ready.

Contrast ratios below were computed for the exact pairs listed. Text pairs are at least 4.5:1 and interactive-control borders are above 3:1.

```css
:root {
  /* Surfaces */
  --color-bg:            #FFFFFF;
  --color-surface:       #F8FAFC;
  --color-surface-2:     #F1F5F9;
  --color-border:        #E2E8F0;   /* decorative dividers and card edges */
  --color-border-strong: #64748B;   /* input and control borders */

  /* Text */
  --color-text:          #0F172A;   /* 17.85:1 on bg */
  --color-text-muted:    #475569;   /* 7.58:1 on bg */

  /* Primary (actions, links, focus) */
  --color-primary:       #4F46E5;   /* white text on it: 6.29:1 */
  --color-primary-hover: #4338CA;   /* white text on it: 7.90:1 */
  --color-on-primary:    #FFFFFF;

  /* AI content (reserved for AI-generated text and AI entry points) */
  --color-ai-surface:    #F5F3FF;
  --color-ai-border:     #C4B5FD;
  --color-ai-text:       #4C1D95;   /* 9.99:1 on ai-surface */

  /* Semantic */
  --color-success-bg:    #DCFCE7;  --color-success-text: #166534;  /* 6.49:1 */
  --color-warning-bg:    #FEF3C7;  --color-warning-text: #92400E;  /* 6.37:1 */
  --color-danger-bg:     #FEE2E2;  --color-danger-text:  #991B1B;  /* 6.80:1 */
  --color-danger:        #B91C1C;                                  /* white text: 6.47:1 */
  --color-info-bg:       #DBEAFE;  --color-info-text:    #1E40AF;  /* 7.15:1 */
}

[data-theme="dark"] {
  --color-bg:            #0B1020;
  --color-surface:       #111827;
  --color-surface-2:     #1F2937;
  --color-border:        #334155;
  --color-border-strong: #64748B;   /* 3.98:1 on bg */

  --color-text:          #F1F5F9;   /* 17.28:1 */
  --color-text-muted:    #94A3B8;   /* 7.38:1 */

  --color-primary:       #818CF8;
  --color-primary-hover: #A5B4FC;
  --color-on-primary:    #0B1020;   /* 6.35:1 on primary */

  --color-ai-surface:    #2E1065;
  --color-ai-border:     #6D28D9;
  --color-ai-text:       #C4B5FD;   /* 8.25:1 */

  --color-success-bg:    #052E16;  --color-success-text: #86EFAC;  /* 10.62:1 */
  --color-warning-bg:    #422006;  --color-warning-text: #FCD34D;  /* 10.11:1 */
  --color-danger-bg:     #450A0A;  --color-danger-text:  #FCA5A5;  /* 8.51:1 */
  --color-info-bg:       #172554;  --color-info-text:    #93C5FD;  /* 8.15:1 */
}
```

**Color rules**
- Primary indigo is for the main action on a screen, links, and focus rings.
- The violet AI palette appears only on AI-generated content blocks and AI entry points (assistant button, "Ask AI" badge). Policy sources and product facts never use it, so users can tell AI wording from system facts at a glance.
- Never use color alone to convey status. Availability, confidence, and order status always include a text label (and an icon).

### 4.2 Typography

- **Family:** Inter (variable) for UI and body, with a system sans-serif fallback stack. Load it with `font-display: swap`.
- **Monospace:** system monospace, used only for order IDs, SKUs, request IDs, and document versions.
- **Numerals:** tabular figures for prices, quantities, and tables.

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `display` | 48 / 56 (36 / 44 on mobile) | 700 | Home hero headline |
| `h1` | 32 / 40 (28 / 36 on mobile) | 700 | Page titles |
| `h2` | 24 / 32 | 600 | Section titles |
| `h3` | 20 / 28 | 600 | Card and panel titles |
| `body` | 16 / 24 | 400 | Default text |
| `body-sm` | 14 / 20 | 400 | Secondary text, table cells |
| `caption` | 12 / 16 | 500 | Badges, helper text, metadata |

### 4.3 Spacing, radius, elevation

- **Spacing scale (4 px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Radius:** 6 px (inputs, badges), 12 px (cards, panels), 999 px (chips, avatars).
- **Elevation:** three levels only: none (flat cards with a 1 px border), `shadow-sm` (hover on cards), `shadow-lg` (drawers, modals, popovers). Prefer borders over shadows.
- **Border:** 1 px `--color-border` for cards and dividers; 1 px `--color-border-strong` for form controls.

### 4.4 Iconography

Use one outline icon set (Lucide is a good fit for React). Icons are 16, 20, or 24 px, with a 1.5–2 px stroke, and inherit `currentColor`. Icon-only buttons always have an accessible name. Product imagery comes from `product_images` and uses `alt_text` from the API.

### 4.5 Motion

- Durations: 120 ms (hover, press), 200 ms (menus, toasts), 300 ms (drawers, page sections).
- Easing: standard ease-out for entering, ease-in for leaving.
- Allowed effects: fade, small translate (≤ 8 px), skeleton shimmer, and a subtle "typing" indicator for the AI.
- Respect `prefers-reduced-motion`: disable translate and shimmer animations and keep only instant state changes.

---

## 5. Layout and Responsiveness

### 5.1 Breakpoints and grid

| Name | Min width | Columns | Gutter | Container |
|---|---|---|---|---|
| `xs` | 0 | 4 | 16 | fluid, 16 px side padding |
| `sm` | 640 | 4 | 16 | fluid |
| `md` | 768 | 8 | 24 | fluid, 24 px side padding |
| `lg` | 1024 | 12 | 24 | max 1200 |
| `xl` | 1280 | 12 | 32 | max 1280 |

### 5.2 Responsive behavior by pattern

| Pattern | xs/sm | md | lg+ |
|---|---|---|---|
| Product grid | 1 column (2 compact) | 3 | 4 |
| Catalog filters | Bottom-sheet drawer opened by a "Filters" button | Collapsible left panel | Persistent left panel (260 px) |
| Product detail | Single column, sticky "Add to cart" bar | Two columns | Two columns (gallery + info) |
| Comparison table | Horizontal scroll with a sticky first column | Scroll if > 3 products | Full width |
| Cart | Items stacked, summary below | Items + summary side by side | Items + sticky summary |
| AI assistant | Full-screen chat, composer pinned | Full-screen chat | Chat with a side panel for referenced products |
| Admin tables | Card list per row | Table with horizontal scroll | Full table |

- Minimum touch target is 44 × 44 px on touch layouts.
- No horizontal page scroll at 360 px except inside the comparison table and admin tables.

---

## 6. Component Library

All components are built once in `components/` and reused by feature folders (PRD Section 15.2). Each must support loading, disabled, error, and focus states.

### 6.1 Core components

| Component | Notes |
|---|---|
| **Button** | Variants: primary, secondary (outline), ghost, danger. Sizes: sm 32, md 40, lg 48 px height. Loading state shows a spinner and disables clicks. |
| **IconButton** | Requires `aria-label`. Used for wishlist heart, remove, close. |
| **TextField / Select / Textarea** | Visible label above the field, helper text below, inline error text with an icon. Required fields are marked with text, not only an asterisk. |
| **PriceRangeFilter** | Two numeric inputs plus a slider. Inline validation: min must not exceed max (PRD: invalid price ranges are rejected). |
| **Chip** | Removable filter chips for active filters; selectable chips for categories. |
| **Badge** | Status badges for availability, order status, ticket status, confidence. Always icon + text. |
| **Rating** | Read-only stars plus numeric value (e.g. "4.5") and an accessible label ("Rated 4.5 out of 5"). |
| **PriceTag** | Formats with `Intl.NumberFormat` using the product's `currency` (USD by default). Optional struck-through original price is not used unless the data supports it. |
| **Card** | Flat card with a border, 12 px radius, hover raises to `shadow-sm` when the card is clickable. |
| **Pagination** | Server-driven. Shows previous/next, current page, and total pages from the API metadata. Page size selector: 12 / 24 / 48. |
| **Tabs** | For product detail (Overview, Specs) and admin screens. Keyboard arrow navigation. |
| **Modal / Drawer** | Focus trap, `Esc` to close, restores focus to the trigger. |
| **Toast** | Non-blocking confirmations (added to cart). Errors that need action use inline banners instead. |
| **Banner** | Inline info, warning, and error messages at the top of a section. |
| **Skeleton** | Matches the final layout shape of cards, rows, and chat bubbles. |
| **EmptyState** | Icon, one-line explanation, and one primary action. |
| **Table** | Sortable headers where the API supports sorting; sticky header on admin tables. |
| **Timeline** | Vertical event list for shipment events (Section 6.3). |
| **FileDropzone** | For admin document upload: shows accepted types (PDF, Markdown, JSON), max size, and per-file progress and errors. |

### 6.2 Commerce components

**ProductCard**
```
┌──────────────────────┐
│  [ image 4:3 ]    ♡  │  wishlist toggle (top right)
├──────────────────────┤
│ Brand                │  caption, muted
│ Product name (2 lines max)│  h3-sm, truncates with ellipsis
│ ★ 4.5                │
│ $899.00              │  PriceTag
│ ● In stock           │  availability badge
│ [Add to cart] [Compare]│
└──────────────────────┘
```
- Whole card links to the product detail page; the buttons stop propagation.
- Image uses `object-fit: cover` with a fixed aspect ratio to avoid layout shift. A neutral placeholder is shown if no image exists.
- "Compare" is a checkbox-style toggle that adds the product to a compare tray (max 4). The tray is a sticky bottom bar with thumbnails and a "Compare (n)" button.

**AvailabilityBadge** (from the API's derived availability)

| Value | Label | Style |
|---|---|---|
| `IN_STOCK` | In stock | success |
| `LOW_STOCK` | Low stock | warning |
| `OUT_OF_STOCK` | Out of stock | danger (and "Add to cart" disabled) |

**CartLineItem:** image, name, unit price, quantity stepper (min 1, max from stock), line total, remove button. Quantity changes call `PATCH /cart/items/{itemId}` and show an inline error on `409` or validation failure.

**CompareTable:** products as columns, specs as rows (from `product_specs`), with rows where values differ highlighted by a subtle background and an "Only show differences" toggle. Sticky first column and sticky product header.

### 6.3 Shipment timeline

Vertical list, newest at the top. Each event shows a status icon, status label, location, and timestamp (local time, with the timezone on hover). The current status has a filled marker; earlier ones are outlined. A caption under the section title reads "Simulated tracking" (PRD Section 6.5).

### 6.4 AI components

Detailed behavior is in Section 8.

| Component | Purpose |
|---|---|
| **AssistantMessage** | AI-authored text in a violet-tinted bubble with a small "AI" label |
| **UserMessage** | Plain neutral bubble, right-aligned |
| **RecommendationList** | Compact product cards with the AI's reason below each |
| **InterpretationChip** | Shows how the AI understood the request (use case, budget) |
| **ConfidenceBadge** | HIGH, MEDIUM, LOW |
| **SourceCard** | Document title, section, version, and effective date for each cited source |
| **AbstainNotice** | "I couldn't confirm this from our policy documents" with next actions |
| **ToolActionCard** | Confirmation and result for actions like creating a support ticket |
| **Composer** | Textarea with send button, character limit, and suggested prompts |

---

## 7. Screen Specifications

Each screen lists its purpose, layout, key components, data source, and states. Endpoints refer to PRD Section 8.

### 7.1 Home (P0)

**Purpose:** introduce the product and send users into shopping or the assistant. Structure follows the reference page, adapted to e-commerce.

```
┌──────────────────────────────────────────────────────────────┐
│ Logo   Shop  Compare  Ask AI  Policies     🔍   ♡  🛒  Log in │
├──────────────────────────────────────────────────────────────┤
│  HERO                                                        │
│  Find the right product. Understand the policy.             │
│  Short subhead.                                              │
│  [ Shop now ]  [ Ask ShopSmart AI ]        ┌───────────────┐ │
│                                            │ chat mockup   │ │
│                                            │ + product card│ │
│                                            └───────────────┘ │
├──────────────────────────────────────────────────────────────┤
│  Brand strip (catalog brands)                                │
├──────────────────────────────────────────────────────────────┤
│  Feature 1: Recommendations tied to real stock               │
│  Feature 2: Policy answers that show their work (sources)    │
│  Feature 3: Track orders and shipments                       │
├──────────────────────────────────────────────────────────────┤
│  Featured categories (from GET /categories)                  │
├──────────────────────────────────────────────────────────────┤
│  Policy FAQ (approved documents only)                        │
├──────────────────────────────────────────────────────────────┤
│  Footer: Shop | Help | Account                               │
└──────────────────────────────────────────────────────────────┘
```

- The hero mockup is a static illustration built with the real components, using seeded demo content, so what it shows is something the product can actually do.
- Feature 2 shows a sample answer card with a `SourceCard`, mirroring the reference's "answers that show their work" idea.
- FAQ items must be copied from the seeded policy documents. Do not write policy claims that are not in those documents (PRD Section 20).
- Logged-in users who open `/` see the same page with "Shop now" leading to `/products`.

### 7.2 Login (P0)

- Centered card: email, password, "Log in" button, generic error banner ("Email or password is incorrect"). The message must not reveal whether the email exists (PRD Section 6.7).
- **P1 demo helper:** in demo mode only, a collapsible "Demo accounts" list (admin and one customer per tier: Basic, Prime, Premium) fills the form. It must be controlled by a build-time flag and absent from any production build.
- On success: store the token per the chosen auth approach, call `GET /auth/me`, route admins to `/admin/products` or Home as decided, and customers to `/products`.
- Expired session: any `401` clears the session and redirects to `/login` with a banner "Your session expired. Please log in again." and returns the user to where they were after login.

### 7.3 Catalog (P0)

**Purpose:** search, filter, sort, and paginate products (PRD Section 6.1).

```
┌─────────────┬────────────────────────────────────────────┐
│ FILTERS     │  Results: 148 products     Sort: [Price ▾] │
│ Category ▾  │  [chip: Electronics ✕] [chip: $500–$1000 ✕]│
│ Brand ☐ ☐   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│ Price range │  │card│ │card│ │card│ │card│               │
│ Rating      │  └────┘ └────┘ └────┘ └────┘               │
│ [Reset]     │              « 1 2 3 … 13 »                │
└─────────────┴────────────────────────────────────────────┘
```

- Data: `GET /products` with `query`, `category`, `brand`, `minPrice`, `maxPrice`, `sort`, `page`, `size`. Filter and sort state lives in the URL query string so results are shareable and survive refresh.
- Category filter renders the hierarchy from `GET /categories` as an expandable tree.
- Sort options: Relevance, Price low to high, Price high to low, Rating.
- Debounce the search field by 300 ms. Changing any filter resets to page 0.
- Active filters appear as removable chips above the results, with a "Clear all" link.
- Result count and current page come from backend pagination metadata. The client never loads the full catalog (PRD acceptance criterion).
- **States:** skeleton grid while loading; empty state ("No products match your filters" with a "Clear filters" action); error banner with "Try again"; invalid price range shown inline and no request sent.
- A floating "Ask AI about these results" button opens the assistant with the current filters as context (P1).

### 7.4 Product detail (P0)

```
┌───────────────────────────┬──────────────────────────────┐
│ [ main image ]            │ Brand                        │
│ [thumb][thumb][thumb]     │ Product name (h1)            │
│                           │ ★ 4.5   SKU: LAP101          │
│                           │ $899.00                      │
│                           │ ● In stock                   │
│                           │ Qty [− 1 +]  [Add to cart]   │
│                           │ [♡ Wishlist] [Compare]       │
├───────────────────────────┴──────────────────────────────┤
│ Tabs: Overview | Specifications                          │
│ Description text / spec table (product_specs)            │
├──────────────────────────────────────────────────────────┤
│ "Have a question about returns or warranty?" [Ask policies]│
└──────────────────────────────────────────────────────────┘
```

- Data: `GET /products/{id}`. Price and availability always come from this response.
- Image gallery uses `product_images` ordered by `sort_order`; thumbnails are keyboard focusable; `alt_text` is used for each image.
- The policy prompt links to `/policies` with the product's category pre-filled as context (feeds the category filter in PRD 6.4).
- On mobile the "Add to cart" button becomes a sticky bottom bar.
- **States:** skeleton; 404 page ("This product isn't available") with a link back to the catalog; out-of-stock disables "Add to cart" and shows the reason in text.

### 7.5 Comparison (P0)

- Entry points: compare toggle on product cards and detail pages; compare tray; `/compare?ids=...`.
- Data: `POST /products/compare` with the selected IDs (2–4). Fewer than 2 selected shows an empty state with a link to the catalog.
- Layout: `CompareTable` (Section 6.2), with product cards in the header row (image, name, price, availability, "Add to cart", "Remove").
- "Only show differences" toggle (default off). Rows are grouped by spec category if the data provides one.
- Mobile: horizontal scroll with a sticky first column; also offer a stacked per-product view toggle (P1).

### 7.6 Cart (P0)

- Data: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/{itemId}`, `DELETE /cart/items/{itemId}`.
- Left: `CartLineItem` list. Right: summary with item subtotal and total. If shipping and tax are not modeled, do not show them. Do not invent numbers.
- Primary action "Place simulated order" appears only if `POST /orders` is implemented (P1), with the caption "No payment is taken. This is a simulated order."
- Unavailable items (stock dropped) are flagged inline with a warning badge and block checkout until resolved.
- **States:** empty cart with a "Continue shopping" action; per-item loading while updating; `409` or validation errors shown on the affected line.

### 7.7 Wishlist (P0)

- Data: `GET /wishlist`, `PUT /wishlist/{productId}`, `DELETE /wishlist/{productId}`.
- Grid of `ProductCard`s with a filled heart. Removing an item shows an undo toast for 5 seconds.
- "Compare selected" button when 2–4 items are checked (P1 shortcut from the PRD).

### 7.8 Preferences (P0)

- Data: `GET /preferences`, `PUT /preferences`.
- Form: preferred categories (multi-select chips), budget minimum and maximum (with the same range validation as the catalog filter).
- Helper text: "The assistant may use these to tailor suggestions. Anything you type in a request overrides them." (P1 behavior; show the sentence only when preference-based recommendations are implemented.)

### 7.9 AI shopping assistant (P0)

See Section 8.1 for rendering rules.

```
┌───────────────────────────────────────────────────────────┐
│ Ask ShopSmart AI                      [New conversation]  │
├───────────────────────────────────────────────────────────┤
│                        ┌────────────────────────────────┐ │
│                        │ Suggest a laptop under $1,000… │ │ user
│                        └────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ AI · Understood: Laptop for Java development & AI     │ │
│ │ Budget: $1,000                                        │ │
│ │ ┌───────────────┐ ┌───────────────┐                   │ │
│ │ │ ProductCard   │ │ ProductCard   │                   │ │
│ │ │ Why: 16GB RAM…│ │ Why: …        │                   │ │
│ │ └───────────────┘ └───────────────┘                   │ │
│ │ AI suggestions are advisory. Price and stock shown    │ │
│ │ come from our catalog.                                │ │
│ └───────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────┤
│ Suggested: [Laptop under $1,000] [Compare two laptops]    │
│ [ Type your question…                         ] [ Send ]  │
└───────────────────────────────────────────────────────────┘
```

- Endpoints: `POST /ai/recommendations` for shopping requests; `POST /ai/chat` for general conversation.
- Suggested prompts come from the PRD demo list (Section 13.4) and are shown when the conversation is empty.
- Conversation history lives in client state for the session (persistence is not in the PRD).

### 7.10 Policy Q&A — knowledge assistant (P0)

See Section 8.2 for rendering rules.

- Layout: same chat shell as the assistant but titled "Ask about policies", with a short subtitle: "Answers come only from approved policy documents."
- Optional context selectors (P1): product category and region, sent as retrieval filters.
- Endpoint: `POST /knowledge/ask`.
- Each answer renders the answer text, `ConfidenceBadge`, a `SourceCard` list, and (when `followUpRequired` is true) a follow-up prompt.
- Suggested prompts (must match seeded documents): "What is the return period for an opened laptop?", "What is the refund timeline?", "Does Prime membership include free delivery?", "Can I cancel my order after it has shipped?", "What is the warranty period for this smartphone?"

### 7.11 Orders list and detail (P0)

**List** (`GET /orders`): table or card list with order ID (monospace), date, item count, total, status badge. Empty state: "You haven't placed any orders yet."

**Detail** (`GET /orders/{id}`):
- Header: order ID, status badge, placed date.
- Items list using the snapshot name and unit price from the order (not live catalog values).
- Shipment `Timeline` with the "Simulated tracking" caption.
- Actions: "Contact support about this order" opens the ticket form with the order pre-selected.
- `404` page for missing orders. Another customer's order returns the same "not found" screen, since the backend must not reveal that it exists (PRD Section 13.2).

### 7.12 Support tickets (P0)

- Data: `GET /support/tickets`, `POST /support/tickets`.
- List with subject, linked order (if any), status badge, created date. "New ticket" opens a drawer or page with: order (optional select of the user's orders), subject, description, and Submit.
- After submission, show a success banner and the new ticket at the top of the list.
- Ticket status badges: Open, In progress, Resolved (match whatever status values the backend defines).
- Assistant-created tickets appear in this list like any other.

### 7.13 Admin: products (P0)

- Data: `GET /products` (as an admin), `POST /admin/products`, `PATCH /admin/products/{id}`.
- Table: SKU, name, brand, category, price, availability, active toggle, "Edit".
- Create/edit in a drawer with validation: required fields, price greater than zero, category select, image URLs with alt text, and a spec editor (key/value rows).
- Deactivating a product shows a confirmation explaining it will disappear from the catalog.

### 7.14 Admin: knowledge documents (P0)

- Data: `POST /admin/knowledge/documents`, `GET /admin/knowledge/documents`, `GET /admin/knowledge/documents/{id}`.
- Upload card: `FileDropzone` accepting PDF, Markdown, and JSON, plus metadata fields: title, document type, version, effective date, region, product category, and membership tier (optional; "All tiers" by default).
- Ingestion progress: Uploading → Extracting → Embedding → Published, with a clear failure state and the backend's safe error message. A failed ingestion is never shown as published (PRD Section 12).
- Document list: title, type, version, effective date, region, category, status badge (Draft, Processing, Published, Failed, Inactive). Published versions are read-only; "Upload new version" is the only way to change a policy (PRD Section 9.3).
- Detail view shows metadata and chunk/section count, not raw chunk text beyond what is needed to verify ingestion.

### 7.15 Admin: audit and AI decisions (P0)

- Data: `GET /admin/audit/events`, `GET /admin/audit/ai-decisions` (PRD Section 8.6).
- Two tabs: **Audit events** (time, actor, action, resource, outcome, request ID) and **AI decisions** (time, user, type, outcome).
- Filters: date range, actor, outcome, decision type.
- AI decision detail panel (read-only), so an admin can explain a result using only the stored record (PRD Section 6.8):
  - Recommendation: interpreted requirement, applied constraints, candidate product IDs, final recommendations with reasons, model identifier, outcome.
  - Knowledge answer: question, applied filters, retrieved chunk IDs with similarity scores, returned sources and confidence, model identifier, outcome (answered or abstained).
- No edit or delete actions anywhere on this screen.

---

## 8. AI Interaction Patterns

### 8.1 Product recommendations

Maps to `POST /ai/recommendations` and PRD Section 6.3.

**Request:** the user's message. Disable the composer while a request is running.

**Response rendering (in this order):**
1. **Interpretation row:** `InterpretationChip`s for `interpretedRequirement` and `budget` (formatted as currency). This is the "here's what I understood" check. If the interpretation is wrong, the user can edit the message and resend.
2. **Recommendation list:** one compact `ProductCard` per item. Name, price, and availability are loaded from the product API by `productId`, not from the AI text. Under each card, the AI's `reason` appears in an AI-styled block labelled "Why this fits".
3. **Clarifying question:** when `clarifyingQuestion` is not null, show it as an AI message with 2–4 quick-reply chips when options are obvious, and keep the composer enabled.
4. **No match:** if there are no recommendations and no clarifying question, show "I couldn't find a product in our catalog that matches. Try changing the budget or requirements." with chips to relax the budget or open the catalog with the same filters.

**Rules**
- A `productId` that fails to load renders nothing for that item and logs the error. The AI text for it is never shown alone.
- The footer line under results reads: "Suggestions are advisory. Price and stock come from our catalog."
- Each card has "Add to cart", "Compare", and "View details".

### 8.2 Policy answers (RAG)

Maps to `POST /knowledge/ask` and PRD Section 6.4.

**Answer block**
```
┌────────────────────────────────────────────────────────────┐
│ AI · Answer                           Confidence: ● High   │
│ Opened laptops can be returned within 7 days if physical   │
│ damage is not present.                                     │
│                                                            │
│ Sources                                                    │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 📄 Laptop Return Policy                                │ │
│ │ Section: Opened Products · Version 2026.1              │ │
│ └────────────────────────────────────────────────────────┘ │
│ Based on approved policy documents. Not legal advice.      │
└────────────────────────────────────────────────────────────┘
```
(The text above is illustrative. Real answers must match the seeded documents.)

**Confidence badge**

| `confidence` | Label | Style | Behavior |
|---|---|---|---|
| `HIGH` | High confidence | success | Normal answer |
| `MEDIUM` | Medium confidence | warning | Add: "Check the source below before relying on this." |
| `LOW` | Low confidence | danger | Use the abstain layout when `followUpRequired` is true |

**Sources**
- Each source is a `SourceCard`: document title, section, version. Effective date is shown if the API returns it.
- Sources are visually distinct from the AI answer: neutral surface, document icon, no violet. This separates "what the AI said" from "what the documents say" (PRD UI principle).
- Multiple sources are listed in the order returned. More than three collapse behind "Show all sources".
- Source cards are not links unless a document-view page exists (P1: opens document metadata).

**Abstain layout (insufficient evidence)**
```
┌────────────────────────────────────────────────────────────┐
│ ⓘ I can't confirm this from our approved policy documents. │
│   Try rephrasing, choose a product category, or contact    │
│   support.                                                 │
│   [ Rephrase ] [ Choose category ] [ Contact support ]     │
└────────────────────────────────────────────────────────────┘
```
- Shown when `confidence` is `LOW` and `followUpRequired` is true. Uses the info style, not the error style, because this is an expected outcome.
- "Contact support" opens the ticket form with the question pre-filled in the description.
- When `followUpRequired` is true and the backend supplies a follow-up question, show it as an AI message with the composer focused.

### 8.3 Tool actions (support assistant)

Applies when the assistant creates a ticket or looks up an order (PRD Section 6.6).

- **Read-only lookups** (order status): show the result inside the AI message as a compact order summary card that links to `/orders/:id`. Data comes from the order API.
- **Writes** (create ticket): the assistant first shows a `ToolActionCard` with the proposed ticket (order, subject, description) and **Confirm** and **Edit** buttons. Nothing is created until the user confirms. After confirmation, the card shows the created ticket ID and a link to `/support`.
- **Denied or failed actions:** show a plain message ("I couldn't do that. You can only access your own orders.") with no internal details.
- **No consequential actions:** the UI never offers cancellations or refunds through the assistant (PRD non-goals). Requests for them get a message pointing to support.

### 8.4 Loading, latency, and failure

| Situation | Behavior |
|---|---|
| Request in progress | Skeleton AI bubble with a typing indicator and "Thinking…" text (also announced to screen readers) |
| Slower than 8 seconds | Append "This is taking longer than usual." and show a "Cancel" button |
| Provider timeout or error | AI error bubble: "The assistant is unavailable right now." with "Try again". Catalog, cart, and orders remain fully usable |
| Malformed or empty AI response | Same as an error; never render raw model output |
| Rate limit or conflict (`409`) | Short message with a retry action |
| Request ID | Errors include a small "Reference: abc123" with a copy button so the issue can be traced in logs |

### 8.5 Trust and disclosure microcopy

- AI-generated blocks carry a small "AI" label.
- Recommendation footer: "Suggestions are advisory. Price and stock come from our catalog."
- Policy footer: "Based on approved policy documents."
- Simulated features are labelled wherever they appear: "Simulated tracking", "Simulated order".
- The UI never says an answer is "guaranteed" or "official" beyond what the cited source states.

---

## 9. States and Feedback

Every data-driven screen implements all five states (PRD Section 14): loading, empty, success, error, and, where relevant, partial (some data failed to load).

| State | Pattern |
|---|---|
| Loading | Skeletons matching final layout. No full-page spinners except on first app load |
| Empty | `EmptyState` with a short explanation and a single primary action |
| Success | Toast for lightweight confirmations; inline banner when the result matters (ticket created) |
| Validation error | Inline under the field, plus an error summary at the top of long forms. Focus moves to the first invalid field |
| Server error | Banner with plain message, "Try again", and the request ID |

**Error mapping (aligned with PRD Section 8.7)**

| Status | UI behavior |
|---|---|
| 400 / 422 | Show field-level messages from the error response |
| 401 | Clear session, redirect to `/login` with "Your session expired" |
| 403 | "You don't have access to this page." with a link Home |
| 404 | "We couldn't find that." with a link back |
| 409 | Explain the conflict (for example insufficient stock) and offer the fix |
| 5xx | Generic message plus request ID |

The UI shows only the safe `message` and `code` from the standard error structure. It never shows stack traces or raw provider errors.

---

## 10. Accessibility (WCAG 2.2 AA)

- **Contrast:** all text and control borders meet the ratios documented in Section 4.1. Re-verify any new color pair before use.
- **Keyboard:** every action reachable by keyboard in a logical order; visible focus ring (2 px `--color-primary` outline with 2 px offset, never removed); skip-to-content link on every page.
- **Semantics:** use real landmarks (`header`, `nav`, `main`, `footer`), headings in order, `button` for actions and `a` for navigation, and `table` markup for tables.
- **Forms:** every input has a programmatic label; errors are associated with `aria-describedby` and announced.
- **Live regions:** the chat transcript is `role="log"` with `aria-live="polite"`. New AI responses are announced; the typing indicator has an accessible text equivalent.
- **Images:** product images use `alt_text` from the API; decorative images use empty `alt`.
- **Status not by color alone:** availability, confidence, order status, and ticket status always have a text label and icon.
- **Touch targets:** at least 44 × 44 px on touch layouts. Target size is never below 24 × 24 px on desktop.
- **Motion:** honors `prefers-reduced-motion` (Section 4.5).
- **Zoom and reflow:** usable at 200% zoom and at 320 px width without loss of content.
- **Timeouts:** the session-expiry flow warns users and preserves their place (Section 7.2).

---

## 11. Content and Microcopy

**Voice:** confident and brief in headlines (borrowed from the reference), plain and precise in everything involving money, policy, or AI.

| Context | Guideline | Example |
|---|---|---|
| Headlines | Benefit-led, under 8 words | "Find the right product, faster" |
| Buttons | Verb first | "Add to cart", "Ask ShopSmart AI" |
| Prices | Currency symbol, two decimals, tabular figures | "$899.00" |
| Errors | What happened, what to do next | "We couldn't load your orders. Try again." |
| AI uncertainty | Direct, not apologetic | "I can't confirm this from our approved policy documents." |
| Simulated features | Always labelled | "Simulated tracking" |
| Dates | Locale format with the time zone available on hover | "Oct 23, 2026, 11:41 AM" |

**Never write:** policy claims that are not in the seeded documents; unverifiable superlatives about the AI; promises of delivery dates or shipping costs (the system does not model them).

---

## 12. Theming

- Tokens in Section 4.1 are the only source of color. Components never hard-code hex values.
- Theme switching toggles `data-theme` on the root element. Default follows `prefers-color-scheme`; a manual toggle in the account menu is P1.
- Product images and brand logos must remain legible in dark mode (use neutral backgrounds behind logos).

---

## 13. Internationalization and Formatting (P2)

- Use `Intl.NumberFormat` and `Intl.DateTimeFormat` with the user's locale for all numbers and dates.
- Currency comes from each product's `currency` field. The demo uses USD.
- Keep all user-facing strings in one place (a `strings` module) so translation can be added later.

---

## 14. Frontend Implementation Notes

These are suggestions that fit the PRD's stack (React 19 + Vite). Swap any item if the team already prefers an alternative.

| Concern | Suggestion |
|---|---|
| Routing | React Router with route guards for authenticated and admin routes |
| Server state | TanStack Query for caching, retries, pagination, and optimistic cart/wishlist updates |
| Forms and validation | React Hook Form with a schema validator (for example Zod) mirroring backend constraints |
| Styling | CSS variables for the tokens above, with Tailwind CSS or CSS Modules for layout |
| Accessible primitives | Radix UI (or an equivalent headless library) for dialogs, drawers, tabs, menus, and tooltips |
| Icons | Lucide |
| API client | One shared client in `api/` that attaches the bearer token, handles `401` globally, parses the standard error structure, and surfaces the request ID |
| Testing | Vitest and React Testing Library for components; one end-to-end smoke test of the demo path if time allows |

**Folder mapping** (PRD Section 15.2): `components/` for the library in Section 6; `features/catalog`, `cart`, `recommendations`, `knowledge`, `orders` for screens and feature hooks; `pages/` for route components; `api/` for the shared client and typed endpoint functions; `hooks/` for shared hooks.

**Rules**
- Never compute or hard-code prices, stock, or order totals on the client. Display what the API returns.
- Never trust client-side role checks for security (PRD Section 14).
- Keep AI response handling in typed adapters that validate the JSON shape before rendering.
- Keep demo-only helpers (demo accounts) behind a build flag.

---

## 15. Build Order and Deliverables

### 15.1 Build order (aligned with PRD Section 16)

| Day | Design and frontend work |
|---|---|
| 1 | Tokens, app shell, nav, Button/Input/Badge/Card, Login, route guards, API client |
| 2 | Catalog, filters, product detail, cart, wishlist, compare tray and table, Home page |
| 3 | Assistant chat shell, `RecommendationList`, policy Q&A with `SourceCard`, `ConfidenceBadge`, `AbstainNotice` |
| 4 | Orders and timeline, support tickets, preferences, admin products, admin knowledge, admin audit |
| 5 | Accessibility pass, responsive pass at 360/768/1280, empty/error/loading audit, demo walkthrough |

If time runs short, defer in this order: dark theme, demo-accounts helper, "Ask AI about these results" shortcut, stacked compare view, product reviews, then policy FAQ polish on Home. Do not cut states and accessibility on P0 screens.

### 15.2 Design checklist before the demo

- [ ] Every PRD Section 14 screen exists and is reachable from the navigation.
- [ ] Every data screen has loading, empty, and error states.
- [ ] AI answers are visually distinct from policy sources and product data.
- [ ] Recommendations show database price and availability, not AI-written values.
- [ ] Policy answers show title, section, version, and confidence; abstention is demonstrable.
- [ ] Simulated tracking and simulated orders are labelled.
- [ ] Keyboard-only walkthrough of login, catalog, cart, and assistant succeeds.
- [ ] No horizontal scroll at 360 px (outside comparison and admin tables).
- [ ] Text contrast verified for any color added after this document.
- [ ] Demo prompts from PRD Section 13.4 work end to end in the UI.

---

## 16. Open Questions

1. **Brand identity:** product name styling, logo, and any brand color preference. The palette here is a neutral proposal.
2. **Reference fidelity:** how closely should the look match the Framer reference? Share screenshots or the exact fonts and colors if it should be closer.
3. **Public catalog:** should unauthenticated visitors browse products (PRD currently protects them)?
4. **Dark theme:** required for the demo, or P1?
5. **Assistant persistence:** should conversations survive a page refresh? (Not required by the PRD.)
6. **Order placement:** will "Place simulated order" from the cart be built (PRD P1)? It affects the Cart screen.
