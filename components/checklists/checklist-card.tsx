'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toggleCompletion } from '@/lib/actions/checklists'
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

type OptimisticAction = { itemId: string; action: 'add' | 'remove' }

export function ChecklistCard({ checklistId, title, items, completions, managerView }: Props) {
  const [isPending, startTransition] = useTransition()

  const [optimisticCompletions, addOptimistic] = useOptimistic(
    completions,
    (current: ChecklistCompletion[], { itemId, action }: OptimisticAction) => {
      if (action === 'remove') {
        return current.filter((c) => c.checklist_item_id !== itemId)
      }
      return [
        ...current,
        {
          id: `optimistic-${itemId}`,
          checklist_item_id: itemId,
          staff_id: '',
          completed_at: new Date().toISOString(),
          completed_date: new Date().toISOString().slice(0, 10),
        },
      ]
    }
  )

  const completionMap = new Map(optimisticCompletions.map((c) => [c.checklist_item_id, c]))
  const completed = optimisticCompletions.length
  const total = items.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = pct === 100

  function handleToggle(itemId: string) {
    const isChecked = completionMap.has(itemId)
    startTransition(async () => {
      addOptimistic({ itemId, action: isChecked ? 'remove' : 'add' })
      try {
        await toggleCompletion(itemId)
      } catch {
        toast.error('Failed to save. Please try again.')
      }
    })
  }

  return (
    <Card className={allDone ? 'bg-emerald-50/30' : ''}>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base">{title}</span>
          <Badge
            variant={allDone ? 'default' : 'secondary'}
            className={allDone ? 'bg-emerald-500 hover:bg-emerald-500 text-white' : ''}
          >
            {completed} / {total}
          </Badge>
        </div>
        <Progress
          value={pct}
          className={`h-1.5 ${allDone ? '[&>div]:bg-emerald-500' : '[&>div]:bg-primary'}`}
        />
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-1 space-y-0.5">
        {items.map((item) => {
          const completion = completionMap.get(item.id)
          const isChecked = !!completion
          const isOptimistic = completion?.id?.startsWith('optimistic-')

          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-2 py-3 rounded-lg transition-colors cursor-pointer
                ${isChecked ? 'opacity-50' : 'hover:bg-muted/50'}`}
              onClick={() => handleToggle(item.id)}
            >
              <Checkbox
                id={item.id}
                checked={isChecked}
                disabled={isPending && isOptimistic}
                className="h-6 w-6 shrink-0 pointer-events-none"
              />
              <span
                className={`flex-1 text-sm leading-snug select-none
                  ${isChecked ? 'line-through text-gray-400' : 'text-foreground'}`}
              >
                {item.task}
              </span>

              {isChecked && !isOptimistic && managerView && completion && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {completion.staff?.name} · {formatTime(completion.completed_at)}
                </span>
              )}
              {isChecked && !isOptimistic && !managerView && (
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
