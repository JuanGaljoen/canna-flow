import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import type { Staff } from '@/types/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let staff: Staff[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('staff')
      .select('id, name, role, email, created_at')
      .order('name')
    staff = data ?? []
  } catch {
    // Supabase not configured yet — render with empty staff list
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header staff={staff} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
