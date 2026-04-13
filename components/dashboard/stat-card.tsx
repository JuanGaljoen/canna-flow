import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string
  note?: string
  highlight?: boolean
  icon: LucideIcon
}

export function StatCard({ label, value, note, highlight, icon: Icon }: Props) {
  return (
    <Card className={cn(
      'transition-colors',
      highlight && 'bg-emerald-50/40'
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className={cn('text-3xl font-bold tracking-tight', highlight ? 'text-emerald-700' : 'text-foreground')}>
              {value}
            </p>
            {note && <p className="text-xs text-muted-foreground">{note}</p>}
          </div>
          <div className={cn(
            'p-2.5 rounded-xl',
            highlight ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
