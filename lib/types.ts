export const CATEGORIES = [
  'computador',
  'ar-condicionado',
  'lampada',
  'projetor',
  'banheiro',
  'limpeza',
  'outro',
] as const

export const STATUSES = ['aberto', 'em-analise', 'em-manutencao', 'resolvido'] as const

export const PRIORITIES = ['baixa', 'media', 'alta'] as const

export type Category = (typeof CATEGORIES)[number]
export type Status = (typeof STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]

export type StatusEvent = {
  status: Status
  at: string
  note?: string
}

export type Report = {
  id: string
  code: string
  category: Category
  description: string
  building: string
  room: string
  priority: Priority
  photos: string[]
  reporterName: string
  status: Status
  createdAt: string
  updatedAt: string
  history: StatusEvent[]
}

export type NewReportInput = {
  category: Category
  description: string
  building: string
  room: string
  priority: Priority
  photos: string[]
  reporterName: string
}
