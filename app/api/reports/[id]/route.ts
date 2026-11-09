import { NextResponse } from 'next/server'
import { isStatus, updateReportStatus } from '@/lib/store'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = (await request.json().catch(() => null)) as { status?: unknown; note?: unknown } | null

  if (!body || !isStatus(body.status)) {
    return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
  }
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 300) : undefined

  const report = updateReportStatus(id, body.status, note)
  if (!report) return NextResponse.json({ error: 'Chamado não encontrado.' }, { status: 404 })
  return NextResponse.json(report)
}
