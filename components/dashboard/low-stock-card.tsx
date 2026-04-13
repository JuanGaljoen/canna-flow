import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import type { Product } from '@/types/products'

export function LowStockCard({ product }: { product: Product }) {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardContent className="p-4 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold leading-tight">{product.name}</p>
          <p className="text-xs text-destructive mt-0.5">
            {product.stock_level === 0 ? 'Out of stock' : `${product.stock_level}g remaining`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
