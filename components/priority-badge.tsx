import { PRIORITY_LABEL } from '@/lib/labels'
import type { Priority } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider',
        priority === 'alta' && 'bg-accent text-accent-foreground',
        priority === 'media' && 'border border-foreground/30 text-foreground',
        priority === 'baixa' && 'bg-muted text-muted-foreground',
      )}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  )
}
