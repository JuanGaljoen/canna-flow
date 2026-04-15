'use client'

import { useEffect, useState, useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'
import type { Staff } from '@/types/database'

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

export function Header({ staff }: { staff: Staff }) {
  const [now, setNow] = useState<Date | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

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
          <span className="text-border">—</span>
        )}
      </div>

      {/* Logged-in user + sign out */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">{staff.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{staff.role}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          disabled={isPending}
          onClick={() => startTransition(() => signOut())}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
