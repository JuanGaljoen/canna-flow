'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ChecklistCard } from './checklist-card'
import { HistoryTable } from './history-table'
import type { ChecklistWithCompletions, DailyHistoryRow } from '@/types/checklists'

interface Props {
  checklists: ChecklistWithCompletions[]
  history: DailyHistoryRow[]
}

export function ChecklistsView({ checklists, history }: Props) {
  const [managerView, setManagerView] = useState(false)

  const morning = checklists.find((c) => c.shift === 'morning')
  const evening = checklists.find((c) => c.shift === 'evening')

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Checklists</h1>
        <div className="flex items-center gap-3">
          <Switch
            id="manager-view"
            checked={managerView}
            onCheckedChange={setManagerView}
          />
          <Label htmlFor="manager-view" className="cursor-pointer">
            Manager view
          </Label>
        </div>
      </div>

      {/* Morning / Evening tabs */}
      <Tabs defaultValue="morning">
        <TabsList className="h-11 bg-muted p-1 rounded-xl">
          <TabsTrigger
            value="morning"
            className="px-8 h-9 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
          >
            Morning
          </TabsTrigger>
          <TabsTrigger
            value="evening"
            className="px-8 h-9 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
          >
            Evening
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="mt-4">
          {morning ? (
            <ChecklistCard
              checklistId={morning.id}
              title={morning.title}
              items={morning.items}
              completions={morning.completions}
              managerView={managerView}
            />
          ) : (
            <p className="text-muted-foreground">No morning checklist found.</p>
          )}
        </TabsContent>

        <TabsContent value="evening" className="mt-4">
          {evening ? (
            <ChecklistCard
              checklistId={evening.id}
              title={evening.title}
              items={evening.items}
              completions={evening.completions}
              managerView={managerView}
            />
          ) : (
            <p className="text-muted-foreground">No evening checklist found.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* 7-day history */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide text-xs">
          Last 7 Days
        </h2>
        <HistoryTable rows={history} />
      </div>
    </div>
  )
}
