import { NextResponse } from 'next/server'
import { createReport, listReports, parseNewReport } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(listReports())
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { data, error } = parseNewReport(body)
  if (!data) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(createReport(data), { status: 201 })
}
