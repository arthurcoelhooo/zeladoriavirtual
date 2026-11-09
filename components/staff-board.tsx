'use client'

import { useState } from 'react'
import { ArrowRight, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from '@/components/priority-badge'
import { StatusPill, StatusTrack } from '@/components/status-track'
import { useReports } from '@/hooks/use-reports'
import { CATEGORY_META, PRIORITY_LABEL, STATUS_LABEL, formatDate } from '@/lib/labels'
import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Report, type Status } from '@/lib/types'
import { cn } from '@/lib/utils'

const PRIORITY_RANK: Record<Priority, number> = { alta: 0, media: 1, baixa: 2 }

const selectClass =
  'rounded-md border border-input bg-card px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function StaffBoard() {
  const { reports, isLoading, mutate } = useReports()
  const [statusFilter, setStatusFilter] = useState<Status | 'todos'>('todos')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'todas'>('todas')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'todas'>('todas')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: reports.filter((r) => r.status === s).length }),
    {} as Record<Status, number>,
  )

  const visible = reports
    .filter((r) => statusFilter === 'todos' || r.status === statusFilter)
    .filter((r) => priorityFilter === 'todas' || r.priority === priorityFilter)
    .filter((r) => categoryFilter === 'todas' || r.category === categoryFilter)
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt.localeCompare(a.createdAt))

  const selected = reports.find((r) => r.id === selectedId) ?? visible[0] ?? null

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Filtrar por status" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(['todos', ...STATUSES] as const).map((s) => {
          const active = statusFilter === s
          const count = s === 'todos' ? reports.length : counts[s]
          return (
            <button
              key={s}
              role="tab"
              aria-selected={active}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors',
                active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-foreground/40',
              )}
            >
              <span className={cn('text-xs', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                {s === 'todos' ? 'Todos' : STATUS_LABEL[s]}
              </span>
              <span className="font-mono text-xl font-semibold">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="f-priority" className="text-sm text-muted-foreground">
          Prioridade
        </label>
        <select
          id="f-priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | 'todas')}
          className={selectClass}
        >
          <option value="todas">Todas</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>
        <label htmlFor="f-category" className="ml-2 text-sm text-muted-foreground">
          Tipo
        </label>
        <select
          id="f-category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'todas')}
          className={selectClass}
        >
          <option value="todas">Todos</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ul className="flex flex-col gap-2" aria-label="Lista de chamados">
          {isLoading &&
            [0, 1, 2, 3].map((i) => <li key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}
          {!isLoading && visible.length === 0 && (
            <li className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhum chamado com esses filtros.
            </li>
          )}
          {visible.map((r) => {
            const { label, icon: Icon } = CATEGORY_META[r.category]
            const active = selected?.id === r.id
            return (
              <li key={r.id}>
                <button
                  onClick={() => setSelectedId(r.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors',
                    active ? 'border-primary ring-1 ring-primary' : 'hover:border-foreground/40',
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
                      <PriorityBadge priority={r.priority} />
                    </span>
                    <span className="truncate text-sm font-medium">{label}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {r.building} · {r.room}
                    </span>
                  </span>
                  <StatusPill status={r.status} />
                </button>
              </li>
            )
          })}
        </ul>

        {selected ? (
          <ReportDetail key={selected.id} report={selected} onUpdated={() => mutate()} />
        ) : (
          !isLoading && (
            <div className="hidden rounded-lg border border-dashed p-6 text-sm text-muted-foreground lg:block">
              Selecione um chamado.
            </div>
          )
        )}
      </div>
    </div>
  )
}

function ReportDetail({ report, onUpdated }: { report: Report; onUpdated: () => void }) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { label, icon: Icon } = CATEGORY_META[report.category]
  const currentIndex = STATUSES.indexOf(report.status)
  const next = STATUSES[currentIndex + 1]

  async function changeStatus(status: Status) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro ao atualizar.')
      setNote('')
      onUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section
      aria-labelledby="detail-title"
      className="flex flex-col gap-5 self-start rounded-xl border bg-card p-5 lg:sticky lg:top-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h2 id="detail-title" className="font-semibold leading-tight">
              {label}
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {report.code} · aberto {formatDate(report.createdAt)}
            </span>
          </div>
        </div>
        <PriorityBadge priority={report.priority} />
      </div>

      <StatusTrack status={report.status} showLabels />

      <p className="leading-relaxed text-pretty">{report.description}</p>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" aria-hidden />
          <dt className="sr-only">Local</dt>
          <dd>
            {report.building} · {report.room}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" aria-hidden />
          <dt className="sr-only">Solicitante</dt>
          <dd>{report.reporterName}</dd>
        </div>
      </dl>

      {report.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {report.photos.map((src, i) => (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="aspect-square overflow-hidden rounded-md border"
            >
              <img src={src || '/placeholder.svg'} alt={`Foto ${i + 1} do chamado ${report.code}`} className="size-full object-cover" />
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t pt-5">
        <label htmlFor="status-note" className="text-sm font-semibold">
          Atualizar status
        </label>
        <textarea
          id="status-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={300}
          rows={2}
          placeholder="Observação para o aluno (opcional)"
          className="w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex flex-wrap gap-2">
          {next ? (
            <Button onClick={() => changeStatus(next)} disabled={saving}>
              Mover para {STATUS_LABEL[next]}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">Chamado finalizado.</span>
          )}
          {STATUSES.filter((s) => s !== report.status && s !== next).map((s) => (
            <Button key={s} variant="outline" onClick={() => changeStatus(s)} disabled={saving}>
              {STATUS_LABEL[s]}
            </Button>
          ))}
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t pt-5">
        <h3 className="text-sm font-semibold">Histórico</h3>
        <ol className="flex flex-col gap-3">
          {[...report.history].reverse().map((h, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span
                className={cn('mt-1.5 size-2 shrink-0 rounded-full', i === 0 ? 'bg-primary' : 'bg-border')}
                aria-hidden
              />
              <div className="flex flex-col">
                <span className="font-medium">
                  {STATUS_LABEL[h.status]}{' '}
                  <time dateTime={h.at} className="font-normal text-muted-foreground">
                    · {formatDate(h.at)}
                  </time>
                </span>
                {h.note && <span className="leading-relaxed text-muted-foreground">{h.note}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
