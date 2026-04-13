'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions/products'
import { CATEGORIES, type Category, type Product } from '@/types/products'

interface Props {
  open: boolean
  onClose: () => void
  product?: Product | null
}

interface FormErrors {
  name?: string
  price?: string
  stock?: string
}

export function ProductDialog({ open, onClose, product }: Props) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!product

  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('flower')
  const [thc, setThc] = useState('')
  const [cbd, setCbd] = useState('')
  const [priceRands, setPriceRands] = useState('')
  const [stock, setStock] = useState('0')
  const [errors, setErrors] = useState<FormErrors>({})

  // Populate fields when dialog opens
  useEffect(() => {
    if (!open) return
    if (product) {
      setName(product.name)
      setCategory(product.category)
      setThc(product.thc_percent?.toString() ?? '')
      setCbd(product.cbd_percent?.toString() ?? '')
      setPriceRands((product.price_cents / 100).toFixed(2))
      setStock(product.stock_level.toString())
    } else {
      setName('')
      setCategory('flower')
      setThc('')
      setCbd('')
      setPriceRands('')
      setStock('0')
    }
    setErrors({})
  }, [open, product])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!priceRands || isNaN(parseFloat(priceRands)) || parseFloat(priceRands) < 0)
      next.price = 'Enter a valid price'
    if (!stock || isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0)
      next.stock = 'Enter a valid stock level'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: name.trim(),
      category,
      thc_percent: thc ? parseFloat(thc) : null,
      cbd_percent: cbd ? parseFloat(cbd) : null,
      price_cents: Math.round(parseFloat(priceRands) * 100),
      stock_level: parseInt(stock, 10),
    }

    startTransition(async () => {
      if (isEditing && product) {
        await updateProduct(product.id, payload)
      } else {
        await createProduct(payload)
      }
      onClose()
    })
  }

  function handleDelete() {
    if (!product) return
    startTransition(async () => {
      await deleteProduct(product.id)
      onClose()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="h-11"
              placeholder="e.g. Gorilla Glue #4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="h-11 capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize py-3">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* THC / CBD */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="thc">THC %</Label>
              <Input
                id="thc"
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="h-11"
                placeholder="0.0"
                value={thc}
                onChange={(e) => setThc(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cbd">CBD %</Label>
              <Input
                id="cbd"
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="h-11"
                placeholder="0.0"
                value={cbd}
                onChange={(e) => setCbd(e.target.value)}
              />
            </div>
          </div>

          {/* Price / Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (R)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="h-11"
                placeholder="0.00"
                value={priceRands}
                onChange={(e) => setPriceRands(e.target.value)}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock (g)</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                className="h-11"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="mr-auto h-11"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-11"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="h-11">
              {isEditing ? 'Save changes' : 'Add product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
