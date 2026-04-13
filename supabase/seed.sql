-- ============================================================
-- seed.sql
-- Dev/staging seed data for Cannabis Ops
-- ============================================================

-- ----------------------------------------------------------------
-- Staff
-- ----------------------------------------------------------------

insert into staff (id, name, role, email) values
  ('00000000-0000-0000-0000-000000000001', 'Thabo Nkosi',       'owner',     'thabo@cannabisops.local'),
  ('00000000-0000-0000-0000-000000000002', 'Keegan van den Berg','manager',  'keegan@cannabisops.local'),
  ('00000000-0000-0000-0000-000000000003', 'Aisha Jacobs',      'budtender', 'aisha@cannabisops.local'),
  ('00000000-0000-0000-0000-000000000004', 'Ryan Fortuin',      'budtender', 'ryan@cannabisops.local');

-- ----------------------------------------------------------------
-- Checklists
-- ----------------------------------------------------------------

insert into checklists (id, title, shift) values
  ('10000000-0000-0000-0000-000000000001', 'Opening Checklist', 'morning'),
  ('10000000-0000-0000-0000-000000000002', 'Closing Checklist', 'evening');

-- ----------------------------------------------------------------
-- Checklist items — Morning (opening)
-- ----------------------------------------------------------------

insert into checklist_items (checklist_id, task, sort_order) values
  ('10000000-0000-0000-0000-000000000001', 'Unlock shop and disarm security system',            1),
  ('10000000-0000-0000-0000-000000000001', 'Switch on display lights, LED strips and signage',  2),
  ('10000000-0000-0000-0000-000000000001', 'Check and record opening till float (R 500)',        3),
  ('10000000-0000-0000-0000-000000000001', 'Restock display jars from back-of-house storage',   4),
  ('10000000-0000-0000-0000-000000000001', 'Check product freshness and remove any stale stock', 5),
  ('10000000-0000-0000-0000-000000000001', 'Review stock levels and flag items below 10 g',      6),
  ('10000000-0000-0000-0000-000000000001', 'Clean and sanitise counter and display surfaces',    7),
  ('10000000-0000-0000-0000-000000000001', 'Check staff WhatsApp group for overnight messages',  8);

-- ----------------------------------------------------------------
-- Checklist items — Evening (closing)
-- ----------------------------------------------------------------

insert into checklist_items (checklist_id, task, sort_order) values
  ('10000000-0000-0000-0000-000000000002', 'Count till and record end-of-day cash balance',      1),
  ('10000000-0000-0000-0000-000000000002', 'Bag, label and place cash in the safe',              2),
  ('10000000-0000-0000-0000-000000000002', 'Lock all display cabinets and storage drawers',      3),
  ('10000000-0000-0000-0000-000000000002', 'Update stock levels in the system for today',        4),
  ('10000000-0000-0000-0000-000000000002', 'Restock display jars ready for the morning shift',   5),
  ('10000000-0000-0000-0000-000000000002', 'Clean and sanitise all work surfaces and trays',     6),
  ('10000000-0000-0000-0000-000000000002', 'Switch off all display lights and non-essential gear',7),
  ('10000000-0000-0000-0000-000000000002', 'Arm security system and lock up',                    8);

-- ----------------------------------------------------------------
-- Products
-- Prices in ZAR cents per gram. Display as R x,xxx.xx
-- ----------------------------------------------------------------

insert into products (name, category, thc_percent, cbd_percent, price_cents, stock_level) values
  ('Gorilla Glue #4',    'Indica',  26.0,  0.1, 20000, 120),
  ('Durban Poison',      'Sativa',  20.0,  0.5, 16000, 200),
  ('OG Kush',            'Indica',  23.0,  0.3, 18000,  85),
  ('Blue Dream',         'Sativa',  21.0,  1.0, 15000, 150),
  ('Wedding Cake',       'Hybrid',  25.0,  0.2, 22000,  60),
  ('Girl Scout Cookies', 'Hybrid',  22.0,  0.5, 19000,  95),
  ('Pineapple Express',  'Sativa',  19.0,  0.8, 14000, 175),
  ('Northern Lights',    'Indica',  22.0,  0.3, 17000, 110),
  ('Strawberry Cough',   'Sativa',  20.0,  0.6, 15500, 130),
  ('Purple Haze',        'Sativa',  18.0,  1.2, 13000, 160);
