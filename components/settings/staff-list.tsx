'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { removeStaff } from '@/lib/actions/staff'
import type { Staff } from '@/types/database'

interface Props {
  staffList: Staff[]
  currentStaffId: string
  canManage: boolean
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  manager: 'Manager',
  budtender: 'Budtender',
}

export function StaffList({ staffList, currentStaffId, canManage }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleRemove(member: Staff) {
    startTransition(async () => {
      const error = await removeStaff(member.id)
      if (error) toast.error(error)
      else toast.success(`${member.name} removed`)
    })
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {staffList.map((member, i) => (
        <div
          key={member.id}
          className={`flex items-center justify-between px-4 py-3 ${
            i < staffList.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <div>
            <p className="text-sm font-medium">
              {member.name}
              {member.id === currentStaffId && (
                <span className="ml-2 text-xs text-muted-foreground">(you)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {member.email} · {ROLE_LABELS[member.role] ?? member.role}
            </p>
          </div>

          {canManage && member.id !== currentStaffId && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
              disabled={isPending}
              onClick={() => handleRemove(member)}
              aria-label={`Remove ${member.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
