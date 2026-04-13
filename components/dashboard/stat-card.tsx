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
    <Card className={cn('transition-colors', highlight && 'border-green-400 bg-green-50/50')}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className={cn('text-3xl font-bold', highlight && 'text-green-600')}>
              {value}
            </p>
            {note && <p className="text-xs text-muted-foreground">{note}</p>}
          </div>
          <div className={cn(
            'p-2 rounded-lg',
            highlight ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
