export type Role = 'manager' | 'budtender'
export type Shift = 'morning' | 'evening'

export interface Staff {
  id: string
  name: string
  role: Role
  email: string
}

export interface Checklist {
  id: string
  title: string
  shift: Shift
}

export interface ChecklistItem {
  id: string
  checklist_id: string
  task: string
}

export interface ChecklistCompletion {
  id: string
  checklist_item_id: string
  staff_id: string
  completed_at: string
  completed_date: string
}

export interface Product {
  id: string
  name: string
  category: string
  thc_percent: number | null
  cbd_percent: number | null
  /** Stored in cents (ZAR). Display as: (price_cents / 100).toFixed(2) */
  price_cents: number
  stock_level: number
}

export interface WalkIn {
  id: string
  timestamp: string
  count: number
}

export interface Sale {
  id: string
  yoco_payment_id: string
  /** Stored in cents (ZAR). Display as R 1,234.50 */
  amount_cents: number
  currency: string
  created_at: string
}
