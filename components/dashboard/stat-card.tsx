import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string
  note?: string
  highlight?: boolean
}

export function StatCard({ label, value, note, highlight }: Props) {
  return (
    <Card className={cn(highlight && 'border-green-500')}>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={cn('text-3xl font-bold mt-1', highlight && 'text-green-600')}>
          {value}
        </p>
        {note && (
          <p className="text-xs text-muted-foreground mt-1">{note}</p>
        )}
      </CardContent>
    </Card>
  )
}
