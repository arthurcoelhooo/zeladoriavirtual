import { Camera, MapPin } from 'lucide-react'
import { PriorityBadge } from '@/components/priority-badge'
import { StatusPill, StatusTrack } from '@/components/status-track'
import { CATEGORY_META, formatDate } from '@/lib/labels'
import type { Report } from '@/lib/types'

export function ReportCard({ report }: { report: Report }) {
  const { label, icon: Icon } = CATEGORY_META[report.category]
  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Icon className="size-4" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold leading-tight">{label}</h3>
            <span className="font-mono text-xs text-muted-foreground">{report.code}</span>
          </div>
        </div>
        <PriorityBadge priority={report.priority} />
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{report.description}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          {report.building} · {report.room}
        </span>
        {report.photos.length > 0 && (
          <span className="flex items-center gap-1">
            <Camera className="size-3.5" aria-hidden />
            {report.photos.length}
          </span>
        )}
        <time dateTime={report.updatedAt}>Atualizado {formatDate(report.updatedAt)}</time>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <StatusTrack status={report.status} />
        </div>
        <StatusPill status={report.status} />
      </div>
    </article>
  )
}
