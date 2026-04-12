# Cannabis Ops

Internal staff operations tool for a cannabis retail shop in Cape Town, South Africa. Built for iPad/tablet in-store use — touch-first, large tap targets, readable at a glance.

> **Not customer-facing.** Internal staff use only.

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router, server components by default
- [Supabase](https://supabase.com/) — Postgres, Auth, Realtime
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) — UI components
- [Recharts](https://recharts.org/) — Data visualisation (Phase 2+)
- [Vercel](https://vercel.com/) — Deployment

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/JuanGaljoen/canna-flow.git
cd canna-flow
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase project credentials and API keys.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (dashboard)/
    checklists/       # Morning/evening shift checklists
    products/         # Product catalogue and stock levels
components/
  layout/             # Sidebar, nav, shell components
  checklists/         # Checklist-specific components
  products/           # Product-specific components
  ui/                 # shadcn/ui primitives (auto-generated)
lib/
  supabase/
    server.ts         # Server-side Supabase client (SSR)
    client.ts         # Browser client (realtime subscriptions only)
  actions/            # Server actions by module
hooks/                # Custom React hooks
types/
  database.ts         # TypeScript types matching DB schema
```

## Code Conventions

- All pages are **server components** by default — add `'use client'` only when needed
- Server actions live in `lib/actions/[module].ts`
- Types live in `types/[module].ts`
- Use the **server client** for all server-side Supabase queries
- Use the **browser client** only for realtime subscriptions
- **shadcn/ui throughout** — no custom components from scratch if shadcn covers it
- **Tailwind only** — no CSS modules or styled-components
- All monetary values stored in **cents (ZAR)** — display as `R 1,234.50`

## Phase Roadmap

| Phase | Scope |
|-------|-------|
| **1 — MVP** | Scaffold · Supabase · Layout · Checklists · Products |
| **2** | Yoco sales dashboard |
| **3** | Walk-in counter (Raspberry Pi / ESP32 sensor) |
| **4** | Reporting · Exports · Multi-shop support |

## External Integrations

### Yoco (Payment Processor)
- Webhook endpoint: `POST /api/yoco/webhook`
- Event: `payment.succeeded`

### Walk-in Sensor *(Phase 3)*
- Hardware: Raspberry Pi or ESP32 with PIR/IR beam-break sensor
- Endpoint: `POST /api/walkin` — body `{ count: 1 }`
- Auth: `X-Sensor-Key` header (`SENSOR_SECRET`)
