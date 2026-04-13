'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard',  href: '/',           icon: LayoutDashboard },
  { label: 'Checklists', href: '/checklists',  icon: ClipboardList   },
  { label: 'Products',   href: '/products',    icon: Package         },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-zinc-900 text-white shrink-0">
      {/* Shop name */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <p className="text-base font-semibold tracking-tight">Cannabis Ops</p>
        <p className="text-xs text-zinc-400 mt-0.5">Cape Town</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors min-h-[52px]',
                active
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white active:bg-zinc-700'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
