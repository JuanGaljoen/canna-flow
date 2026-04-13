'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { User } from 'lucide-react'
import type { Staff } from '@/types/database'

export const STAFF_STORAGE_KEY = 'canna_ops_staff_id'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function Header({ staff }: { staff: Staff[] }) {
  const [now, setNow] = useState<Date | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')

  useEffect(() => {
    setNow(new Date())
    const stored = localStorage.getItem(STAFF_STORAGE_KEY)
    if (stored) setSelectedStaffId(stored)

    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  function handleSelect(value: string) {
    setSelectedStaffId(value)
    localStorage.setItem(STAFF_STORAGE_KEY, value)
  }

  const selectedStaff = staff.find((m) => m.id === selectedStaffId)

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      {/* Date / time */}
      <div className="text-sm text-muted-foreground">
        {now ? (
          <>
            <span className="font-medium text-foreground">{formatDate(now)}</span>
            <span className="mx-2 text-border">·</span>
            <span>{formatTime(now)}</span>
          </>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </div>

      {/* Staff selector — render name manually to avoid SelectValue showing UUID */}
      <Select value={selectedStaffId} onValueChange={handleSelect}>
        <SelectTrigger className="w-52 h-11 gap-2">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          {selectedStaff ? (
            <span className="font-medium truncate">{selectedStaff.name}</span>
          ) : (
            <span className="text-muted-foreground">Select staff…</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {staff.map((member) => (
            <SelectItem key={member.id} value={member.id} className="py-3">
              <div className="flex flex-col">
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </header>
  )
}
