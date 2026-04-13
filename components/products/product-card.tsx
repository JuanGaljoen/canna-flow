'use client'

import { useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { updateStockLevel } from '@/lib/actions/products'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/products'

interface Props {
  product: Product
  onEdit: (product: Product) => void
}

const CATEGORY_STYLES: Record<string, string> = {
  flower:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  edibles:      'bg-amber-50 text-amber-700 border-amber-200',
  concentrates: 'bg-orange-50 text-orange-700 border-orange-200',
  'pre-rolls':  'bg-yellow-50 text-yellow-700 border-yellow-200',
  accessories:  'bg-sky-50 text-sky-700 border-sky-200',
  other:        'bg-zinc-50 text-zinc-600 border-zinc-200',
}

function categoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.other
}

function stockVariant(level: number) {
  if (level <= 2) return 'destructive'
  if (level <= 10) return 'secondary'
  return 'default'
}

function stockLabel(level: number) {
  if (level <= 2) return 'Low'
  if (level <= 10) return 'Medium'
  return 'In stock'
}

function formatPrice(cents: number) {
  return `R ${(cents / 100).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function ProductCard({ product, onEdit }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleStock(delta: number, e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => updateStockLevel(product.id, delta))
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onClick={() => onEdit(product)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(product)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Name + category */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-tight">{product.name}</p>
          <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize shrink-0',
            categoryStyle(product.category)
          )}>
            {product.category}
          </span>
        </div>

        {/* THC / CBD */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          {product.thc_percent != null && (
            <span>THC {product.thc_percent}%</span>
          )}
          {product.cbd_percent != null && (
            <span>CBD {product.cbd_percent}%</span>
          )}
        </div>

        {/* Price */}
        <p className="text-base font-bold">{formatPrice(product.price_cents)}</p>

        {/* Stock controls */}
        <div className="flex items-center justify-between pt-1">
          <Badge
            variant={stockVariant(product.stock_level)}
            className={cn(
              product.stock_level <= 2 && 'animate-pulse'
            )}
          >
            {stockLabel(product.stock_level)} · {product.stock_level}g
          </Badge>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9"
              disabled={isPending || product.stock_level === 0}
              onClick={(e) => handleStock(-1, e)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9"
              disabled={isPending}
              onClick={(e) => handleStock(1, e)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
