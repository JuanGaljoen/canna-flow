import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { ChecklistWithCompletions } from '@/types/checklists'

interface Props {
  checklist: ChecklistWithCompletions
  shiftLabel: string
}

export function ShiftSummary({ checklist, shiftLabel }: Props) {
  const completed = checklist.completions.length
  const total = checklist.items.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = pct === 100

  const completedIds = new Set(checklist.completions.map((c) => c.checklist_item_id))
  const remaining = checklist.items.filter((i) => !completedIds.has(i.id))
  const nextTasks = remaining.slice(0, 3)

  return (
    <Card className={allDone ? 'bg-emerald-50/30' : ''}>
      <CardContent className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{shiftLabel} Checklist</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {allDone ? 'All tasks complete' : `${completed} of ${total} tasks done`}
            </p>
          </div>
          {allDone ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          ) : (
            <span className="text-2xl font-bold tracking-tight">{pct}%</span>
          )}
        </div>

        {/* Progress bar */}
        <Progress
          value={pct}
          className={`h-2 ${allDone ? '[&>div]:bg-emerald-500' : '[&>div]:bg-primary'}`}
        />

        {/* Next tasks preview */}
        {!allDone && nextTasks.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Up next
            </p>
            {nextTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {task.task}
              </div>
            ))}
            {remaining.length > 3 && (
              <p className="text-xs text-muted-foreground pl-3.5">
                +{remaining.length - 3} more
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href="/checklists"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Open full checklist
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
