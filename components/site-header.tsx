'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Registrar problema' },
  { href: '/painel', label: 'Painel da equipe' },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wrench className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">Zeladoria Campus</span>
            <span className="text-xs text-muted-foreground">Chamados de manutenção</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex gap-1 rounded-lg bg-muted p-1">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors sm:flex-none',
                  active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
