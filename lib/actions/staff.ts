'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getSessionStaff } from '@/lib/actions/auth'
import { revalidatePath } from 'next/cache'
import type { Role, Staff } from '@/types/database'

export async function getStaffList(): Promise<Staff[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, email, user_id, created_at')
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []) as Staff[]
}

export async function inviteStaff(
  name: string,
  email: string,
  role: Role
): Promise<string | null> {
  const current = await getSessionStaff()
  if (current.role === 'budtender') return 'Only managers can invite staff.'

  const admin = createAdminClient()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Create the auth user and send the invite email
  const { data, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback`,
  })
  if (inviteError) return inviteError.message

  // Create the linked staff record
  const { error: staffError } = await admin.from('staff').insert({
    name: name.trim(),
    email,
    role,
    user_id: data.user.id,
  })

  if (staffError) {
    // Roll back the auth user so we don't leave orphaned accounts
    await admin.auth.admin.deleteUser(data.user.id)
    return staffError.message
  }

  revalidatePath('/settings')
  return null
}

export async function removeStaff(staffId: string): Promise<string | null> {
  const current = await getSessionStaff()
  if (current.role === 'budtender') return 'Only managers can remove staff.'
  if (current.id === staffId) return 'You cannot remove your own account.'

  const admin = createAdminClient()

  // Get the user_id so we can delete the auth account too
  const { data: staff, error: fetchError } = await admin
    .from('staff')
    .select('user_id')
    .eq('id', staffId)
    .single()

  if (fetchError) return fetchError.message

  const { error } = await admin.from('staff').delete().eq('id', staffId)
  if (error) return error.message

  if (staff.user_id) {
    await admin.auth.admin.deleteUser(staff.user_id)
  }

  revalidatePath('/settings')
  return null
}
