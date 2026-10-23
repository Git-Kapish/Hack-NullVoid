# ShopSmart AI — Frontend (React 19 + Vite)

Autonomous E-Commerce Assistant Platform frontend built with React 19, Vite, and Vanilla CSS, directly incorporating the enterprise AI agent visual aesthetic from [wrapper.framer.ai](https://wrapper.framer.ai/).

---

## Key Features

1. **Enterprise AI Aesthetic**:
   - Sleek dark-mode first design system with radiant purple/blue glows, thin 1px borders, and frosted glass navigation.
   - Dual-mode Light / Dark theme toggle stored in `localStorage`.
   - Dedicated luminous violet accent (`#8B5CF6`) for all AI-generated content and reasoning steps to visually separate AI inference from verified database facts.

2. **1-Click Demo Persona Switcher**:
   - `/login` provides 1-click quick-fill buttons for 4 seeded hackathon personas:
     - **Admin** (`admin@shopsmart.ai`): Unlocks Admin Product Inventory and AI Decision Audit Logs.
     - **Prime Member** (`sarah.prime@example.com`): 30-day return window and free 2-day shipping.
     - **Premium Member** (`elena.premium@example.com`): 60-day returns, doorstep pickup, same-day delivery, and accidental warranty protection.
     - **Basic Customer** (`david.basic@example.com`): Standard 14-day return window.

3. **Dual-Mode Resilient API Layer**:
   - `src/api/client.js` queries `http://localhost:8000/api/v1`.
   - If the FastAPI backend is offline or an endpoint returns a network error, the client gracefully falls back to deterministic in-memory mock data (`src/data/mockData.js`).
   - Every single screen and user flow is 100% interactive and demo-ready immediately.

4. **12 Complete Screens**:
   - `/` — **Home**: Hero with interactive live shopping assistant preview tabs, brand marquee, 3 bento cards, curated categories, and key platform highlights.
   - `/login` — **Login**: Quick persona switcher + credentials authentication.
   - `/products` — **Product Catalog**: Category filters, brand checkboxes, min/max price slider, stock toggle, search debounce, sorting, and pagination.
   - `/products/:id` — **Product Detail**: Multi-image gallery, real-time inventory count, specs table, and contextual "Ask AI about this product" shortcut.
   - `/compare` — **Comparison Matrix**: Side-by-side spec comparison of 2–4 products with "Highlight Differences Only" toggle and floating compare tray.
   - `/cart` — **Cart**: Line item steppers with stock enforcement, dynamic tax/shipping calculation, and simulated checkout.
   - `/wishlist` — **Wishlist**: Saved items with 1-click move to cart.
   - `/assistant` — **AI Shopping Assistant**: Conversational agent inspired by `wrapper.framer.ai` with prompt chips, multi-step reasoning indicator, and grounded product recommendation cards.
   - `/orders` & `/orders/:id` — **Order Tracking**: Simulated order milestones (`PLACED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`) with locations and timestamps.
   - `/support` — **Support Operations**: Ticket creation and simulated specialist replies.
   - `/account/preferences` — **Customer Preferences**: Shopping categories and budget ceiling settings.
   - `/admin/products` — **Admin Products**: Real-time stock counts and pricing edits.
   - `/admin/audit` — **Admin Audit**: Security event log and raw AI decision payload inspector.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Running Locally
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.
