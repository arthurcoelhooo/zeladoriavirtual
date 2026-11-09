import { RecentReports } from '@/components/recent-reports'
import { ReportForm } from '@/components/report-form'
import { SiteHeader } from '@/components/site-header'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-12">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Viu algo quebrado no campus? Avise a manutenção.
          </h1>
          <p className="leading-relaxed text-muted-foreground text-pretty">
            Registre o problema com foto e local. Você recebe um código para acompanhar cada etapa até a solução.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ReportForm />
          <RecentReports />
        </div>
      </main>
    </>
  )
}
