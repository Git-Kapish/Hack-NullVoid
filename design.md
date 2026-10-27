# ShopSmart AI Design System & Homepage Architecture (DESIGN.md)

This document specifies the design tokens, visual guidelines, component hierarchy, and responsive implementation rules for **ShopSmart AI**, transforming the homepage from a generic SaaS preview into an Amazon/Flipkart-inspired, AI-first consumer electronics e-commerce platform.

---

## 1. Brand Identity & Official Logo

### Concept
The **ShopSmart AI** visual mark unifies two core concepts:
1. **Commerce / Retail**: Clean, architectural shopping tote bag silhouette with handle arcs.
2. **Artificial Intelligence**: An inset luminous four-point diamond spark and neural nodes, signifying deterministic RAG grounding, catalog intelligence, and smart recommendations.

### Wordmark & Colors
- **Icon Mark**: Indigo-to-Violet gradient (`linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #2563EB 100%)`) with soft ambient luminescence (`rgba(124, 58, 237, 0.25)`).
- **Text**: `ShopSmart` in **Geist / Inter** weight 650 with tight letter-spacing (`-0.03em`).
- **AI Tag**: Pill badge with gradient fill or subtle border (`#8B5CF6`) positioned alongside the wordmark.
- **Dark & Light Mode**: Automatically adapts using CSS variables (`--color-text` and `--color-primary`).

---

## 2. Design System Tokens

### Color Palette

| Token | Light Mode Value | Dark Mode Value | Usage |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0A0A0A` | Main page background |
| `--color-surface` | `#FAFAFA` | `#141416` | Cards, panels, containers |
| `--color-surface-2` | `#F4F4F5` | `#1A1A1E` | Secondary cards, pill backgrounds |
| `--color-surface-elevated` | `#FFFFFF` | `#161618` | Modals, floating trays, dropdowns |
| `--color-border` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.09)` | Standard divider & card borders |
| `--color-border-strong` | `rgba(0, 0, 0, 0.16)` | `rgba(255, 255, 255, 0.22)` | Hover borders, active toggles |
| `--color-text` | `#0A0A0A` | `#FAFAFA` | Primary headings and text |
| `--color-text-muted` | `#666666` | `#A1A1A1` | Secondary descriptions, SKUs |
| `--color-text-subtle` | `#999999` | `#737373` | Minor captions, timestamps |
| `--color-primary` | `#0A0A0A` | `#FAFAFA` | Primary action buttons |
| `--color-on-primary` | `#FFFFFF` | `#0A0A0A` | Text on primary buttons |
| `--color-ai-surface` | `#F5F3FF` | `rgba(139, 92, 246, 0.08)` | AI chips, reasoning highlights |
| `--color-ai-text` | `#6D28D9` | `#C4B5FD` | AI text and badges |
| `--color-ai-border` | `#C4B5FD` | `rgba(167, 139, 250, 0.35)` | AI borders |
| `--color-danger` | `#EF4444` | `#F87171` | Deal discount badges, alerts |
| `--color-success-text` | `#059669` | `#34D399` | In-stock badges, positive metrics |

### Typography Scale
- **Display**: `clamp(2rem, 4vw, 3rem)` / 500 weight / line-height `1.1`
- **H1**: `clamp(1.5rem, 3vw, 2.25rem)` / 600 weight / line-height `1.2`
- **H2**: `1.35rem` / 600 weight / line-height `1.25`
- **H3**: `1.1rem` / 600 weight / line-height `1.3`
- **Body**: `0.925rem` / 400 weight / line-height `1.55`
- **Small/Badge**: `0.75rem` / 600 weight / line-height `1`
- **Tabular Mono**: `font-variant-numeric: tabular-nums` for prices, timers, and ratings.

### Elevation & Border Radii
- **Radii**:
  - `--radius-sm`: `8px` (Buttons, thumbnails)
  - `--radius-md`: `14px` (Product cards, deal blocks)
  - `--radius-lg`: `20px` (Hero promo cards, banners)
  - `--radius-full`: `9999px` (Pills, badges, floating controls)
- **Shadows**:
  - Card hover: `0 8px 24px -4px rgba(0, 0, 0, 0.08)`
  - Elevated tray: `0 20px 40px -8px rgba(0, 0, 0, 0.12)`

---

## 3. Homepage Component Hierarchy (Amazon & Flipkart E-Commerce Model)

The new homepage replaces arbitrary B2B dashboard previews with an e-commerce storefront structure:

```
Home (E-Commerce Storefront)
│
├── 1. Category Quick-Navigation Strip
│   ├── Audio & Sound (Headphones, Speakers)
│   ├── Laptops & Computers (MacBooks, ThinkPads, Ultrabooks)
│   ├── Smart Wearables (Watches, Fitness)
│   └── Keyboards & Peripherals (Mechanical, Mice)
│
├── 2. Hero Interactive Promotional Banner Carousel
│   ├── Slide 1: Seasonal Tech Fest (Up to 35% Off MacBooks + Prime Perks)
│   ├── Slide 2: Next-Gen Acoustic Audio (Sony XM5, ANC Wireless)
│   ├── Slide 3: Intelligent Shopping with ShopSmart AI Assistant
│   └── Quick Perks Strip: ⚡ 2-Day Shipping | 🔒 30-Day Returns | 🤖 AI Price Match | 🛡️ Verified Authentic
│
├── 3. "Today's Flash Deals" / Limited-Time Offers (Countdown Bar)
│   ├── Countdown clock (Hours : Minutes : Seconds)
│   ├── Deal cards with % discount chips, original price strikethroughs, and stock meters
│   └── Quick Add to Cart & Compare toggles
│
├── 4. "AI Curated Recommendations" (Grounded Personalization)
│   ├── AI Sparkle Header: "Recommended For You • Grounded in Your Preferences"
│   ├── Product cards with high-res images, star reviews, and availability badges
│   └── Direct deep links to ProductDetail.jsx
│
├── 5. Interactive "Ask ShopSmart AI" Shopping Concierge Spotlight
│   ├── Interactive Search / Query Bar
│   ├── Preset Intent Chips:
│   │   ├── "Laptops under $1000"
│   │   ├── "Noise-cancelling headphones for flights"
│   │   ├── "Ergonomic keyboard with Mac layout"
│   │   └── "GPS fitness watch with heart rate sensor"
│   └── Instant routing to /assistant or live smart search
│
├── 6. "Top Tech Categories & Bestsellers"
│   ├── Best in Laptops
│   ├── Best in Audio
│   └── Best in Peripherals
│
└── 7. E-Commerce Trust & Guarantee Badges
    ├── Free Expedited Delivery
    ├── 30-to-60 Day Hassle-Free Returns (Clerk Tier Based)
    ├── 24/7 AI-Assisted Customer Support
    └── 100% Verified Hardware Specs
```

---

## 4. Responsive Layout Strategy

- **Mobile Viewport (<768px)**:
  - Category strip renders as horizontally scrollable pills with touch snapping.
  - Hero banners compress with stacked typography and full-width CTA buttons.
  - Product grids automatically collapse to 1 or 2 columns (`repeat(auto-fill, minmax(160px, 1fr))`).
  - Interactive AI chips wrap cleanly without horizontal overflow.
- **Tablet Viewport (768px – 1024px)**:
  - 3-column product showcase grids.
  - Side-by-side hero text and graphic card.
- **Desktop Viewport (>1024px)**:
  - Full-width hero carousel with side-by-side deal teasers.
  - 4-column balanced product cards grid (`repeat(auto-fill, minmax(260px, 1fr))`).
  - Smooth micro-interactions, scale transitions on card hover (`scale(1.02)`), and instant badge feedback.

---

## 5. Technical Integration & Reusability

- Reuses existing `<ProductCard />` component with `getProductImage`, `FALLBACK_PRODUCT_IMAGE`, and `onError` fallback handling.
- Reuses `<Badge />`, `<Button />`, `<Skeleton />`, and `lucide-react` icons.
- Connects directly to `api.get('/products')` and in-memory mock data to fetch real live catalog products.
- Integrates seamlessly with `useCartWishlist()` and `useCompare()` contexts for zero-latency cart updates and spec comparisons.
- Zero breaking changes to existing routes, backend Prisma schemas, Inngest events, or Clerk authentication flows.
