'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type {
  ChecklistWithCompletions,
  DailyHistoryRow,
} from '@/types/checklists'

/** All checklists with their items, ordered by shift then sort_order */
export async function getChecklists(): Promise<ChecklistWithCompletions[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('checklists')
    .select(`
      id, title, shift, created_at,
      items:checklist_items (
        id, checklist_id, task, sort_order, created_at
      )
    `)
    .order('shift')
    .order('sort_order', { referencedTable: 'checklist_items' })

  if (error) throw new Error(error.message)

  return (data ?? []).map((c) => ({ ...c, completions: [] }))
}

/** Today's completions for a given checklist, with staff name joined */
export async function getCompletionsForToday(checklistId: string) {
  const supabase = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('checklist_completions')
    .select(`
      id, checklist_item_id, staff_id, completed_at, completed_date,
      staff:staff ( name )
    `)
    .eq('completed_date', today)
    .in(
      'checklist_item_id',
      await getItemIdsForChecklist(checklistId)
    )

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Insert or delete a completion for today (toggle) */
export async function toggleCompletion(
  checklistItemId: string,
  staffId: string
) {
  const supabase = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  // Check for existing completion today
  const { data: existing } = await supabase
    .from('checklist_completions')
    .select('id')
    .eq('checklist_item_id', checklistItemId)
    .eq('completed_date', today)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('checklist_completions')
      .delete()
      .eq('id', existing.id)
  } else {
    await supabase
      .from('checklist_completions')
      .insert({
        checklist_item_id: checklistItemId,
        staff_id: staffId,
        completed_date: today,
      })
  }

  revalidatePath('/checklists')
}

/** Last N days of completion history grouped by date and shift */
export async function getCompletionHistory(
  days = 7
): Promise<DailyHistoryRow[]> {
  const supabase = createAdminClient()

  // Fetch all checklists with items to know totals per shift
  const { data: checklists } = await supabase
    .from('checklists')
    .select('id, shift, items:checklist_items(id)')

  const morningChecklist = checklists?.find((c) => c.shift === 'morning')
  const eveningChecklist = checklists?.find((c) => c.shift === 'evening')
  const morningTotal = morningChecklist?.items?.length ?? 0
  const eveningTotal = eveningChecklist?.items?.length ?? 0
  const morningItemIds = morningChecklist?.items?.map((i: { id: string }) => i.id) ?? []
  const eveningItemIds = eveningChecklist?.items?.map((i: { id: string }) => i.id) ?? []

  // Build date range
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  // Fetch completions for the date range
  const { data: completions } = await supabase
    .from('checklist_completions')
    .select('checklist_item_id, completed_date')
    .gte('completed_date', dates[0])
    .lte('completed_date', dates[dates.length - 1])

  const rows: DailyHistoryRow[] = dates.map((date) => {
    const dayCompletions = completions?.filter(
      (c) => c.completed_date === date
    ) ?? []

    const morningCompleted = dayCompletions.filter((c) =>
      morningItemIds.includes(c.checklist_item_id)
    ).length

    const eveningCompleted = dayCompletions.filter((c) =>
      eveningItemIds.includes(c.checklist_item_id)
    ).length

    return {
      date,
      morning_total: morningTotal,
      morning_completed: morningCompleted,
      morning_pct: morningTotal > 0
        ? Math.round((morningCompleted / morningTotal) * 100)
        : 0,
      evening_total: eveningTotal,
      evening_completed: eveningCompleted,
      evening_pct: eveningTotal > 0
        ? Math.round((eveningCompleted / eveningTotal) * 100)
        : 0,
    }
  })

  return rows
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

async function getItemIdsForChecklist(checklistId: string): Promise<string[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('checklist_items')
    .select('id')
    .eq('checklist_id', checklistId)
  return (data ?? []).map((r) => r.id)
}
