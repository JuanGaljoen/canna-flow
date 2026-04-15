'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Staff } from '@/types/database'

export async function signIn(email: string, password: string): Promise<string | null> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return error.message

  redirect('/')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/** Returns the staff record for the currently authenticated user. Throws if not found. */
export async function getSessionStaff(): Promise<Staff> {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  const admin = createAdminClient()

  // Primary lookup: by linked user_id
  const { data: byUserId } = await admin
    .from('staff')
    .select('id, name, role, email, user_id, created_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (byUserId) return byUserId as Staff

  // Fallback: match by email and auto-link (handles manually created admin accounts)
  const { data: byEmail, error } = await admin
    .from('staff')
    .select('id, name, role, email, user_id, created_at')
    .eq('email', user.email!)
    .maybeSingle()

  if (error || !byEmail) throw new Error('No staff record found for this account. Contact your manager.')

  // Persist the link so future logins use the fast path
  await admin.from('staff').update({ user_id: user.id }).eq('id', byEmail.id)

  return { ...byEmail, user_id: user.id } as Staff
}
