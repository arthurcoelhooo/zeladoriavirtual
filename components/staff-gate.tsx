'use client'

import { FormEvent, useState } from 'react'
import { LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StaffBoard } from '@/components/staff-board'

const STAFF_PASSWORD = 'admin'

export function StaffGate() {
  const [password, setPassword] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [hasError, setHasError] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const authorized = password === STAFF_PASSWORD
    setIsAuthorized(authorized)
    setHasError(!authorized)
    if (authorized) setPassword('')
  }

  if (isAuthorized) return <StaffBoard />

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <LockKeyhole aria-hidden="true" className="size-6" />
      </div>
      <h2 className="text-xl font-semibold">Digite a senha para acessar</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Esta área é exclusiva para a equipe responsável pelos chamados.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-3 text-left">
        <label htmlFor="staff-password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="staff-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setHasError(false)
          }}
          placeholder="Digite a senha"
          autoComplete="current-password"
          autoFocus
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-invalid={hasError}
          aria-describedby={hasError ? 'staff-password-error' : undefined}
        />
        {hasError && (
          <p id="staff-password-error" role="alert" className="text-sm text-destructive">
            Senha incorreta. Tente novamente.
          </p>
        )}
        <Button type="submit" className="mt-2 w-full">
          Acessar painel
        </Button>
      </form>
    </section>
  )
}
