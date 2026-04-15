import { getSessionStaff } from '@/lib/actions/auth'
import { getStaffList } from '@/lib/actions/staff'
import { InviteStaffForm } from '@/components/settings/invite-staff-form'
import { StaffList } from '@/components/settings/staff-list'

export default async function SettingsPage() {
  const [currentStaff, staffList] = await Promise.all([
    getSessionStaff(),
    getStaffList(),
  ])

  const canManage = currentStaff.role === 'manager' || currentStaff.role === 'owner'

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      {/* Staff section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Staff</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {canManage
              ? 'Manage who has access to Cannabis Ops.'
              : 'People with access to Cannabis Ops.'}
          </p>
        </div>

        <StaffList
          staffList={staffList}
          currentStaffId={currentStaff.id}
          canManage={canManage}
        />

        {canManage && (
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="text-sm font-semibold">Invite someone</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                They&apos;ll receive an email to set their password and sign in.
              </p>
            </div>
            <InviteStaffForm />
          </div>
        )}
      </div>
    </div>
  )
}
