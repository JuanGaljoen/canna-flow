export const CATEGORIES = [
  'flower',
  'edibles',
  'concentrates',
  'pre-rolls',
  'accessories',
  'other',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Product {
  id: string
  name: string
  category: Category
  thc_percent: number | null
  cbd_percent: number | null
  /** ZAR cents — display as R x,xxx.xx */
  price_cents: number
  stock_level: number
  created_at: string
  updated_at: string
}

export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>
