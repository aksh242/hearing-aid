# Hearing Aid Management (Next.js)

A lightweight hearing-aid store management app built with Next.js 14 (App Router). It provides a small in-memory API and a minimal UI to manage customers, orders, invoices (PDF), and appointments.

## Tech Stack
- Next.js 14, React 18
- In-memory data store (`lib/store.js`)
- PDF generation via `pdfkit`

## Prerequisites
- Node.js 18.17+ (Next.js 14 requirement)
- npm 9+ (or a compatible package manager)

## Getting Started
1) Install dependencies
```
npm install
```

2) Configure environment variables
Create `.env.local` in the project root (already present in this repo). The API requires a Bearer token for all `/api` requests via `middleware`:
```
ADMIN_TOKEN=change-me-secret-token
NEXT_PUBLIC_ADMIN_TOKEN=change-me-secret-token
```
- Both values must match. The default values work locally. Change them for security if exposing beyond local.

3) Run the app (development)
```
npm run dev
```
- App: http://localhost:3000
- UI pages: `app/` routes
  - `/` Dashboard
  - `/customers`
  - `/orders`
  - `/orders/new`
  - `/orders/[id]`
  - `/appointments`

4) Build and start (production)
```
npm run build
npm start
```

## Environment & Auth
- All API routes are protected by `middleware` in `middleware.js`.
- Clients must send `Authorization: Bearer <ADMIN_TOKEN>`.
- The client UI uses `NEXT_PUBLIC_ADMIN_TOKEN` to call APIs from the browser. Keep both tokens equal for local development.

## Data & Persistence
- Data is stored in-memory (`lib/store.js`) and resets on server restart or rebuild.
- Seed data includes one sample customer and a few hearing aids.

## API Endpoints (JSON)
All endpoints require the Authorization header.
Example header: `Authorization: Bearer change-me-secret-token`

- Customers
  - GET `/api/customers` → list
  - POST `/api/customers` → create
    - body: `{ first_name, last_name, email, phone, address?, hearing_loss_level, budget_range, has_insurance? }`
  - GET `/api/customers/:id` → detail
  - PUT `/api/customers/:id` → update (partial)

- Hearing Aids
  - GET `/api/hearing-aids` → list
  - GET `/api/hearing-aids/recommend/:customerId` → recommended products for customer

- Orders
  - GET `/api/orders` → list
  - POST `/api/orders` → create
    - body: `{ customer_id, items: [{ hearing_aid_id, quantity?, unit_price?, ear_side? }], order_date?, status?, delivery_date?, tracking_number?, notes? }`
    - Calculates `insurance_discount` and `final_amount` using `utils.calculateDiscount()`
  - GET `/api/orders/:id` → detail
  - PUT `/api/orders/:id/status` → update status/tracking
    - body: `{ status?, tracking_number? }` (status one of: `ordered|shipped|delivered|fitted`)
  - GET `/api/orders/:id/invoice` → generates and downloads a PDF invoice
    - Uses `pdfkit`; route is forced to Node runtime

- Appointments
  - GET `/api/appointments` → list
  - POST `/api/appointments` → create
    - body: `{ customer_id, order_id?, appointment_type, scheduled_date, status?, notes? }`
  - PUT `/api/appointments/:id` → update (partial)

## PDF Generation
- `app/api/orders/[id]/invoice/route.js` dynamically imports `pdfkit` and streams a PDF.
- `next.config.js` whitelists `pdfkit`/`fontkit` with `serverExternalPackages` and `experimental.serverComponentsExternalPackages`.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm start` — start production server
- `npm run strip:next` — helper script (`scripts/strip-next-comments.mjs`); not required for local dev


