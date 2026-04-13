import { createAdminClient } from '@/lib/supabase/admin'
import { getCompletionsForToday } from '@/lib/actions/checklists'
import { StatCard } from '@/components/dashboard/stat-card'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { LowStockCard } from '@/components/dashboard/low-stock-card'
import { ShiftSummary } from '@/components/dashboard/shift-summary'
import { Users, Sun, Moon } from 'lucide-react'
import type { ChecklistWithCompletions } from '@/types/checklists'
import type { Product } from '@/types/products'

function getShift(): 'morning' | 'evening' {
  return new Date().getHours() < 14 ? 'morning' : 'evening'
}

function formatToday() {
  return new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

async function getDashboardData() {
  const supabase = createAdminClient()

  const [{ data: checklists }, { data: lowStock }] = await Promise.all([
    supabase
      .from('checklists')
      .select(`
        id, title, shift, created_at,
        items:checklist_items ( id, checklist_id, task, sort_order, created_at )
      `)
      .order('shift')
      .order('sort_order', { referencedTable: 'checklist_items' }),
    supabase
      .from('products')
      .select('*')
      .lte('stock_level', 2)
      .order('stock_level'),
  ])

  return {
    checklists: checklists ?? [],
    lowStock: (lowStock ?? []) as Product[],
  }
}

function pct(checklist?: ChecklistWithCompletions) {
  if (!checklist || checklist.items.length === 0) return 0
  return Math.round((checklist.completions.length / checklist.items.length) * 100)
}

export default async function DashboardPage() {
  const shift = getShift()
  const { checklists, lowStock } = await getDashboardData()

  const checklistsWithCompletions: ChecklistWithCompletions[] = await Promise.all(
    checklists.map(async (c) => ({
      ...c,
      completions: await getCompletionsForToday(c.id),
    }))
  )

  const morning = checklistsWithCompletions.find((c) => c.shift === 'morning')
  const evening = checklistsWithCompletions.find((c) => c.shift === 'evening')
  const activeChecklist = checklistsWithCompletions.find((c) => c.shift === shift)
  const shiftLabel = shift === 'morning' ? 'Morning Shift' : 'Evening Shift'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatToday()}
            <span className="mx-2">·</span>
            <span className="font-medium text-foreground">{shiftLabel}</span>
          </p>
        </div>
        <RefreshButton />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Walk-ins Today"
          value="—"
          note="Sensor coming in Phase 3"
          icon={Users}
        />
        <StatCard
          label="Morning Checklist"
          value={`${pct(morning)}%`}
          note={`${morning?.completions.length ?? 0} of ${morning?.items.length ?? 0} tasks done`}
          highlight={pct(morning) === 100}
          icon={Sun}
        />
        <StatCard
          label="Evening Checklist"
          value={`${pct(evening)}%`}
          note={`${evening?.completions.length ?? 0} of ${evening?.items.length ?? 0} tasks done`}
          highlight={pct(evening) === 100}
          icon={Moon}
        />
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-destructive">
            Low Stock · {lowStock.length} product{lowStock.length > 1 ? 's' : ''}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {lowStock.map((product) => (
              <LowStockCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Active shift summary */}
      {activeChecklist && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active Shift
          </h2>
          <ShiftSummary checklist={activeChecklist} shiftLabel={shiftLabel} />
        </div>
      )}
    </div>
  )
}
