import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { StaffGate } from '@/components/staff-gate'

export const metadata: Metadata = {
  title: 'Painel da equipe · Zeladoria Campus',
}

export default function PainelPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Painel da equipe</h1>
          <p className="text-sm text-muted-foreground">
            Chamados ordenados por prioridade. Selecione um para ver detalhes e atualizar o status.
          </p>
        </div>
        <StaffGate />
      </main>
    </>
  )
}
