'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Staff } from '@/types/database'

// Key used across the app to read the active staff member
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

  // Avoid hydration mismatch — set time only on client
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

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      {/* Date / time */}
      <div className="text-sm text-muted-foreground">
        {now ? (
          <>
            <span className="font-medium text-foreground">{formatDate(now)}</span>
            <span className="mx-2 text-gray-300">·</span>
            <span>{formatTime(now)}</span>
          </>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </div>

      {/* Staff selector */}
      <Select value={selectedStaffId} onValueChange={handleSelect}>
        <SelectTrigger className="w-52 h-11">
          <SelectValue placeholder="Select staff member…" />
        </SelectTrigger>
        <SelectContent>
          {staff.map((member) => (
            <SelectItem key={member.id} value={member.id} className="py-3">
              <span className="font-medium">{member.name}</span>
              <span className="ml-2 text-xs text-muted-foreground capitalize">
                {member.role}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </header>
  )
}
