'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Package, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard',  href: '/',           icon: LayoutDashboard },
  { label: 'Checklists', href: '/checklists',  icon: ClipboardList   },
  { label: 'Products',   href: '/products',    icon: Package         },
  { label: 'Settings',   href: '/settings',    icon: Settings        },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-zinc-900 text-white shrink-0">
      {/* Shop name */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <p className="text-sm font-semibold tracking-tight text-white">Cannabis Ops</p>
        </div>
        <p className="text-xs text-zinc-500 mt-1 ml-[18px]">Cape Town</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all min-h-[52px]',
                active
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 active:bg-zinc-800'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-emerald-400" />
              )}
              <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-emerald-400' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
