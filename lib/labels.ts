import { AirVent, Bath, CircleHelp, Lightbulb, Monitor, Projector, SprayCan, type LucideIcon } from 'lucide-react'
import type { Category, Priority, Status } from './types'

export const CATEGORY_META: Record<Category, { label: string; icon: LucideIcon }> = {
  computador: { label: 'Computador quebrado', icon: Monitor },
  'ar-condicionado': { label: 'Ar-condicionado', icon: AirVent },
  lampada: { label: 'Lâmpada queimada', icon: Lightbulb },
  projetor: { label: 'Projetor com defeito', icon: Projector },
  banheiro: { label: 'Problema no banheiro', icon: Bath },
  limpeza: { label: 'Problema de limpeza', icon: SprayCan },
  outro: { label: 'Outro problema', icon: CircleHelp },
}

export const STATUS_LABEL: Record<Status, string> = {
  aberto: 'Aberto',
  'em-analise': 'Em análise',
  'em-manutencao': 'Em manutenção',
  resolvido: 'Resolvido',
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

export const BUILDINGS = ['Bloco A', 'Bloco B', 'Bloco C', 'Biblioteca', 'Laboratórios', 'Área comum']

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
