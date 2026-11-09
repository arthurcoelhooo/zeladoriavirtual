'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { ReportCard } from '@/components/report-card'
import { useReports } from '@/hooks/use-reports'
import type { Report } from '@/lib/types'

export function RecentReports() {
  const { reports, isLoading, error } = useReports()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? reports.filter(
        (report: Report) =>
          report.code.toLowerCase().includes(q) ||
          report.room.toLowerCase().includes(q) ||
          report.building.toLowerCase().includes(q),
      )
    : reports.slice(0, 6)

  return (
    <section aria-labelledby="track-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="track-title" className="text-lg font-semibold">
          Acompanhar chamados
        </h2>
        <p className="text-sm text-muted-foreground">Busque pelo código, bloco ou sala.</p>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="track-search" className="sr-only">
          Buscar chamado
        </label>
        <input
          id="track-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="CH-1004, Bloco B, Sala 204..."
          className="w-full rounded-md border border-input bg-card py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {error && <p className="text-sm text-destructive">Não foi possível carregar os chamados.</p>}
      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum chamado encontrado.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <ReportCard report={r} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
