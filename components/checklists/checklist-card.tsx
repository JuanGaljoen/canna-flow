'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

export function ChecklistCard({ checklistId, title, items, completions, managerView }: Props) {
  const [isPending, startTransition] = useTransition()

  const completionMap = new Map(completions.map((c) => [c.checklist_item_id, c]))
  const completed = completions.length
  const total = items.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = pct === 100

  function handleToggle(itemId: string) {
    const staffId = localStorage.getItem(STAFF_STORAGE_KEY)
    if (!staffId) {
      alert('Select a staff member in the header first.')
      return
    }
    startTransition(() => toggleCompletion(itemId, staffId))
  }

  return (
    <Card className={allDone ? 'border-green-400' : ''}>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base">{title}</span>
          <Badge
            variant={allDone ? 'default' : 'secondary'}
            className={allDone ? 'bg-green-500 hover:bg-green-500' : ''}
          >
            {completed} / {total}
          </Badge>
        </div>
        <Progress
          value={pct}
          className={`h-1.5 ${allDone ? '[&>div]:bg-green-500' : ''}`}
        />
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-1 space-y-0.5">
        {items.map((item) => {
          const completion = completionMap.get(item.id)
          const isChecked = !!completion

          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-2 py-3 rounded-lg transition-colors cursor-pointer
                ${isChecked ? 'opacity-60' : 'hover:bg-muted/40'}`}
              onClick={() => handleToggle(item.id)}
            >
              <Checkbox
                id={item.id}
                checked={isChecked}
                onCheckedChange={() => handleToggle(item.id)}
                disabled={isPending}
                className="h-6 w-6 shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className={`flex-1 text-sm leading-snug select-none
                  ${isChecked ? 'line-through text-gray-400' : 'text-foreground'}`}
              >
                {item.task}
              </span>

              {isChecked && managerView && completion && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {completion.staff?.name} · {formatTime(completion.completed_at)}
                </span>
              )}
              {isChecked && !managerView && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
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
