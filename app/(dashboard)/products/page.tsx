import { getProducts } from '@/lib/actions/products'
import { ProductsView } from '@/components/products/products-view'

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsView products={products} />
}
