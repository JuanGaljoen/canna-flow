import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { DailyHistoryRow } from '@/types/checklists'

function PctCell({ pct, completed, total }: { pct: number; completed: number; total: number }) {
  if (pct === 100) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-green-600">100%</span>
        <span className="text-xs text-muted-foreground">{completed}/{total}</span>
      </div>
    )
  }
  if (pct === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }
  return (
    <div className="flex items-center gap-2">
      <span className={cn('text-sm font-medium', pct >= 50 ? 'text-amber-600' : 'text-orange-600')}>
        {pct}%
      </span>
      <span className="text-xs text-muted-foreground">{completed}/{total}</span>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().slice(0, 10)
}

export function HistoryTable({ rows }: { rows: DailyHistoryRow[] }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-semibold text-foreground">Date</TableHead>
            <TableHead className="font-semibold text-foreground">Morning</TableHead>
            <TableHead className="font-semibold text-foreground">Evening</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date}
              className={isToday(row.date) ? 'bg-muted/30 font-medium' : ''}
            >
              <TableCell>
                <span className={isToday(row.date) ? 'font-semibold' : ''}>
                  {formatDate(row.date)}
                </span>
                {isToday(row.date) && (
                  <span className="ml-2 text-xs text-muted-foreground">(today)</span>
                )}
              </TableCell>
              <TableCell>
                <PctCell
                  pct={row.morning_pct}
                  completed={row.morning_completed}
                  total={row.morning_total}
                />
              </TableCell>
              <TableCell>
                <PctCell
                  pct={row.evening_pct}
                  completed={row.evening_completed}
                  total={row.evening_total}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
