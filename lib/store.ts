import { CATEGORIES, PRIORITIES, STATUSES, type NewReportInput, type Report, type Status } from './types'

// Temporary server-side store. Swap these functions for database queries once a database is connected.
type StoreShape = { reports: Report[]; counter: number }

const globalStore = globalThis as unknown as { __reportStore?: StoreShape }

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString()
}

function seed(): StoreShape {
  const reports: Report[] = [
    {
      id: crypto.randomUUID(),
      code: 'CH-1004',
      category: 'ar-condicionado',
      description: 'Ar-condicionado pingando água em cima das carteiras da primeira fileira e fazendo barulho alto.',
      building: 'Bloco B',
      room: 'Sala 204',
      priority: 'alta',
      photos: [],
      reporterName: 'Marina S.',
      status: 'em-manutencao',
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(4),
      history: [
        { status: 'aberto', at: hoursAgo(30) },
        { status: 'em-analise', at: hoursAgo(20), note: 'Técnico de climatização acionado.' },
        { status: 'em-manutencao', at: hoursAgo(4), note: 'Troca da bandeja de dreno em andamento.' },
      ],
    },
    {
      id: crypto.randomUUID(),
      code: 'CH-1003',
      category: 'projetor',
      description: 'Projetor liga mas a imagem fica amarelada e piscando. Aula de cálculo prejudicada.',
      building: 'Bloco A',
      room: 'Auditório 1',
      priority: 'media',
      photos: [],
      reporterName: 'Lucas P.',
      status: 'em-analise',
      createdAt: hoursAgo(26),
      updatedAt: hoursAgo(10),
      history: [
        { status: 'aberto', at: hoursAgo(26) },
        { status: 'em-analise', at: hoursAgo(10) },
      ],
    },
    {
      id: crypto.randomUUID(),
      code: 'CH-1002',
      category: 'lampada',
      description: 'Duas lâmpadas queimadas no corredor perto da escada. Fica bem escuro à noite.',
      building: 'Bloco C',
      room: 'Corredor 2º andar',
      priority: 'baixa',
      photos: [],
      reporterName: 'Ana R.',
      status: 'resolvido',
      createdAt: hoursAgo(72),
      updatedAt: hoursAgo(48),
      history: [
        { status: 'aberto', at: hoursAgo(72) },
        { status: 'em-analise', at: hoursAgo(66) },
        { status: 'em-manutencao', at: hoursAgo(52) },
        { status: 'resolvido', at: hoursAgo(48), note: 'Lâmpadas substituídas por LED.' },
      ],
    },
    {
      id: crypto.randomUUID(),
      code: 'CH-1001',
      category: 'computador',
      description: 'Computador da bancada 12 não liga. Já testamos outra tomada.',
      building: 'Laboratórios',
      room: 'Lab. Informática 3',
      priority: 'media',
      photos: [],
      reporterName: 'Pedro H.',
      status: 'aberto',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(2),
      history: [{ status: 'aberto', at: hoursAgo(2) }],
    },
  ]
  return { reports, counter: 1004 }
}

function store(): StoreShape {
  if (!globalStore.__reportStore) globalStore.__reportStore = seed()
  return globalStore.__reportStore
}

export function listReports(): Report[] {
  return [...store().reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function createReport(input: NewReportInput): Report {
  const s = store()
  s.counter += 1
  const now = new Date().toISOString()
  const report: Report = {
    ...input,
    id: crypto.randomUUID(),
    code: `CH-${s.counter}`,
    status: 'aberto',
    createdAt: now,
    updatedAt: now,
    history: [{ status: 'aberto', at: now }],
  }
  s.reports.push(report)
  return report
}

export function updateReportStatus(id: string, status: Status, note?: string): Report | null {
  const report = store().reports.find((r) => r.id === id)
  if (!report) return null
  const now = new Date().toISOString()
  report.status = status
  report.updatedAt = now
  report.history.push({ status, at: now, note: note || undefined })
  return report
}

const MAX_PHOTOS = 3
const MAX_PHOTO_CHARS = 800_000

function cleanText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export function parseNewReport(body: unknown): { data?: NewReportInput; error?: string } {
  if (!body || typeof body !== 'object') return { error: 'Dados inválidos.' }
  const b = body as Record<string, unknown>

  if (!CATEGORIES.includes(b.category as never)) return { error: 'Selecione o tipo de problema.' }
  if (!PRIORITIES.includes(b.priority as never)) return { error: 'Selecione a prioridade.' }

  const description = cleanText(b.description, 1000)
  const building = cleanText(b.building, 60)
  const room = cleanText(b.room, 80)
  const reporterName = cleanText(b.reporterName, 80) || 'Anônimo'

  if (description.length < 10) return { error: 'Descreva o problema com pelo menos 10 caracteres.' }
  if (!building || !room) return { error: 'Informe o bloco e a sala/local.' }

  const photos = Array.isArray(b.photos) ? b.photos : []
  if (photos.length > MAX_PHOTOS) return { error: `Envie no máximo ${MAX_PHOTOS} fotos.` }
  for (const p of photos) {
    if (typeof p !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(p) || p.length > MAX_PHOTO_CHARS) {
      return { error: 'Uma das fotos é inválida ou muito grande.' }
    }
  }

  return {
    data: {
      category: b.category as NewReportInput['category'],
      priority: b.priority as NewReportInput['priority'],
      description,
      building,
      room,
      reporterName,
      photos: photos as string[],
    },
  }
}

export function isStatus(value: unknown): value is Status {
  return STATUSES.includes(value as never)
}
