import { STATUS_LABEL } from '@/lib/labels'
import { STATUSES, type Status } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StatusTrack({ status, showLabels = false }: { status: Status; showLabels?: boolean }) {
  const current = STATUSES.indexOf(status)
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex gap-1" aria-label={`Status: ${STATUS_LABEL[status]}`}>
        {STATUSES.map((s, i) => (
          <li
            key={s}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i <= current ? (status === 'resolvido' ? 'bg-primary' : 'bg-primary/80') : 'bg-border',
            )}
          >
            <span className="sr-only">
              {STATUS_LABEL[s]} {i <= current ? '(concluído)' : '(pendente)'}
            </span>
          </li>
        ))}
      </ol>
      {showLabels && (
        <div className="grid grid-cols-4 gap-1 text-xs">
          {STATUSES.map((s, i) => (
            <span
              key={s}
              className={cn(i === current ? 'font-semibold text-foreground' : 'text-muted-foreground')}
            >
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'resolvido' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'resolvido' ? 'bg-primary-foreground' : status === 'aberto' ? 'bg-accent' : 'bg-primary',
        )}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
