'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { Category, Product, ProductFormData } from '@/types/products'

export async function getProducts(category?: Category): Promise<Product[]> {
  const supabase = createAdminClient()

  let query = supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createProduct(data: ProductFormData): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/products')
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/products')
}

/** Increment or decrement stock. Clamps at 0. */
export async function updateStockLevel(
  id: string,
  delta: number
): Promise<void> {
  const supabase = createAdminClient()

  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock_level')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const newLevel = Math.max(0, product.stock_level + delta)

  const { error } = await supabase
    .from('products')
    .update({ stock_level: newLevel })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/products')
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/products')
}
