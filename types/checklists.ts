export type Shift = 'morning' | 'evening'

export interface ChecklistItem {
  id: string
  checklist_id: string
  task: string
  sort_order: number
  created_at: string
}

export interface ChecklistCompletion {
  id: string
  checklist_item_id: string
  staff_id: string
  completed_at: string
  completed_date: string
  // Joined
  staff?: { name: string }
}

export interface Checklist {
  id: string
  title: string
  shift: Shift
  created_at: string
  items: ChecklistItem[]
}

export interface ChecklistWithCompletions extends Checklist {
  completions: ChecklistCompletion[]
}

export interface DailyHistoryRow {
  date: string
  morning_total: number
  morning_completed: number
  morning_pct: number
  evening_total: number
  evening_completed: number
  evening_pct: number
}
