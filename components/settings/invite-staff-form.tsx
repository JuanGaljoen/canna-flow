'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inviteStaff } from '@/lib/actions/staff'
import type { Role } from '@/types/database'

export function InviteStaffForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('budtender')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const error = await inviteStaff(name, email, role)
      if (error) {
        toast.error(error)
      } else {
        toast.success(`Invite sent to ${email}`)
        setName('')
        setEmail('')
        setRole('budtender')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="invite-name">Full name</Label>
          <Input
            id="invite-name"
            className="h-11"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            className="h-11"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="h-11 w-48 capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budtender" className="py-3">Budtender</SelectItem>
            <SelectItem value="manager" className="py-3">Manager</SelectItem>
            <SelectItem value="owner" className="py-3">Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 bg-primary hover:bg-primary/90"
      >
        {isPending ? 'Sending invite…' : 'Send invite'}
      </Button>
    </form>
  )
}
