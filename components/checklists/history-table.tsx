import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { DailyHistoryRow } from '@/types/checklists'

function pctBadge(pct: number) {
  const variant =
    pct === 100 ? 'default' : pct >= 50 ? 'secondary' : 'destructive'
  return <Badge variant={variant}>{pct}%</Badge>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function HistoryTable({ rows }: { rows: DailyHistoryRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Morning</TableHead>
          <TableHead>Evening</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.date}>
            <TableCell className="font-medium">{formatDate(row.date)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {pctBadge(row.morning_pct)}
                <span className="text-xs text-muted-foreground">
                  {row.morning_completed}/{row.morning_total}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {pctBadge(row.evening_pct)}
                <span className="text-xs text-muted-foreground">
                  {row.evening_completed}/{row.evening_total}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
