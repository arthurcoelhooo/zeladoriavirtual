'use client'

import useSWR from 'swr'
import type { Report } from '@/lib/types'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Falha ao carregar chamados')
  return res.json()
}

export function useReports() {
  const { data, error, isLoading, mutate } = useSWR<Report[]>('/api/reports', fetcher, {
    refreshInterval: 15000,
  })
  return { reports: data ?? [], error, isLoading, mutate }
}
