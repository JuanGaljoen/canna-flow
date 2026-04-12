# Cannabis Ops — Internal Shop Management Tool

## Project Overview
Internal staff operations tool for a cannabis retail shop in Cape Town, South Africa.
The shop operates in a legal grey area (personal use decriminalised, commercial sale restricted).
This is NOT a customer-facing app — it's purely for internal staff use.

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Postgres, Auth, Realtime)
- shadcn/ui + Tailwind CSS + TypeScript
- Recharts for data visualisation
- Deployed on Vercel

## Target Device
iPad / tablet in-store. Design for touch-first, large tap targets, readable at a glance.

## Database Schema
- staff (id, name, role, email)
- checklists (id, title, shift: 'morning'|'evening')
- checklist_items (id, checklist_id, task)
- checklist_completions (id, checklist_item_id, staff_id, completed_at)
- products (id, name, category, thc_percent, cbd_percent, price_cents, stock_level)
- walk_ins (id, timestamp, count) — Phase 3
- sales (id, yoco_payment_id, amount_cents, currency, created_at)

## Monetary Values
All prices and sales amounts stored in cents (ZAR). Always display divided by 100, formatted as R 1,234.50.

## Key Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- YOCO_SECRET_KEY (sk_live_...)
- SENSOR_SECRET (shared secret for walk-in sensor API)

## External Integrations
### Yoco (Payment Processor)
- Base URL: https://payments.yoco.com/api
- Auth: Bearer token (YOCO_SECRET_KEY)
- Webhook event: payment.succeeded
- Webhook endpoint: /api/yoco/webhook

### Walk-in Sensor (Phase 3)
- Raspberry Pi or ESP32 with PIR/IR beam-break sensor
- POSTs to /api/walkin with { count: 1 }
- Authenticated via X-Sensor-Key header (SENSOR_SECRET)

## Phase Roadmap
- Phase 1 (MVP): Scaffold + Supabase + Layout + Checklists + Products
- Phase 2: Yoco sales dashboard
- Phase 3: Walk-in counter (hardware sensor integration)
- Phase 4: Reporting, exports, multi-shop support

## Code Conventions
- Server actions in lib/actions/[module].ts
- Types in types/[module].ts
- Supabase server client for all server-side queries
- Supabase browser client only for realtime subscriptions
- All pages are server components by default; add 'use client' only when needed
- shadcn/ui components throughout — no custom component from scratch if shadcn covers it
- Tailwind only — no CSS modules or styled-components