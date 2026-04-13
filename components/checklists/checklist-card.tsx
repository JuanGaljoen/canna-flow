'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toggleCompletion } from '@/lib/actions/checklists'
import { STAFF_STORAGE_KEY } from '@/components/layout/header'
import type { ChecklistItem, ChecklistCompletion } from '@/types/checklists'

interface Props {
  checklistId: string
  title: string
  items: ChecklistItem[]
  completions: ChecklistCompletion[]
  managerView: boolean
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function ChecklistCard({
  checklistId,
  title,
  items,
  completions,
  managerView,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const completionMap = new Map(
    completions.map((c) => [c.checklist_item_id, c])
  )

  const completed = completions.length
  const total = items.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  function handleToggle(itemId: string) {
    const staffId = localStorage.getItem(STAFF_STORAGE_KEY)
    if (!staffId) {
      alert('Please select a staff member in the header first.')
      return
    }
    startTransition(() => {
      toggleCompletion(itemId, staffId)
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={pct === 100 ? 'default' : 'secondary'}>
            {completed} / {total}
          </Badge>
        </div>
        <Progress value={pct} className="h-2 mt-2" />
      </CardHeader>

      <CardContent className="space-y-1">
        {items.map((item) => {
          const completion = completionMap.get(item.id)
          const isChecked = !!completion

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 px-2 py-3.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={item.id}
                checked={isChecked}
                onCheckedChange={() => handleToggle(item.id)}
                disabled={isPending}
                className="h-6 w-6 shrink-0"
              />
              <label
                htmlFor={item.id}
                className={`flex-1 text-sm leading-snug cursor-pointer select-none ${
                  isChecked ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.task}
              </label>

              {isChecked && managerView && completion && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {completion.staff?.name} · {formatTime(completion.completed_at)}
                </span>
              )}

              {isChecked && !managerView && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(completion!.completed_at)}
                </span>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
