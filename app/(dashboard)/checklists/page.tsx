import { getChecklists, getCompletionsForToday, getCompletionHistory } from '@/lib/actions/checklists'
import { ChecklistsView } from '@/components/checklists/checklists-view'
import type { ChecklistWithCompletions } from '@/types/checklists'

export default async function ChecklistsPage() {
  const [checklists, history] = await Promise.all([
    getChecklists(),
    getCompletionHistory(7),
  ])

  // Attach today's completions to each checklist
  const checklistsWithCompletions: ChecklistWithCompletions[] = await Promise.all(
    checklists.map(async (checklist) => {
      const completions = await getCompletionsForToday(checklist.id)
      return { ...checklist, completions }
    })
  )

  return <ChecklistsView checklists={checklistsWithCompletions} history={history} />
}
