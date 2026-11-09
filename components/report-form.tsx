'use client'

import { useRef, useState, type FormEvent } from 'react'
import { CircleCheck, ImagePlus, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReports } from '@/hooks/use-reports'
import { compressImage } from '@/lib/compress-image'
import { CATEGORY_META, PRIORITY_LABEL } from '@/lib/labels'
import { CATEGORIES, PRIORITIES, type Category, type Priority, type Report } from '@/lib/types'
import { cn } from '@/lib/utils'

const MAX_PHOTOS = 3
const inputClass =
  'w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'

export function ReportForm() {
  const { mutate } = useReports()
  const formRef = useRef<HTMLFormElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [priority, setPriority] = useState<Priority>('media')
  const [photos, setPhotos] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<Report | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const room = MAX_PHOTOS - photos.length
    const selected = Array.from(files).slice(0, room)
    try {
      const compressed = await Promise.all(selected.map((f) => compressImage(f)))
      setPhotos((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS))
    } catch {
      setError('Não foi possível processar uma das imagens.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!category) {
      setError('Selecione o tipo de problema.')
      return
    }

    const form = new FormData(event.currentTarget)
    const description = String(form.get('description') ?? '').trim()
    const building = String(form.get('building') ?? '').trim()
    const room = String(form.get('room') ?? '').trim()
    const reporterName = String(form.get('reporterName') ?? '').trim()

    if (!description || description.length < 10) {
      setError('Descreva o problema com pelo menos 10 caracteres.')
      return
    }

    if (!building || !room) {
      setError('Digite onde fica o problema e o local exato.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          priority,
          photos,
          description,
          building,
          room,
          reporterName: reporterName || 'Anônimo',
        }),
      })
      const data = (await res.json()) as Report | { error?: string }
      if (!res.ok) throw new Error('error' in data ? data.error ?? 'Erro ao enviar.' : 'Erro ao enviar.')
      setCreated(data as Report)
      await mutate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    formRef.current?.reset()
    setCreated(null)
    setCategory(null)
    setPriority('media')
    setPhotos([])
    setError(null)
  }

  if (created) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border bg-card p-6">
        <CircleCheck className="size-8 text-primary" aria-hidden />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Chamado registrado</h2>
          <p className="leading-relaxed text-muted-foreground">
            Guarde o código abaixo para acompanhar o andamento. A equipe de manutenção já foi notificada.
          </p>
        </div>
        <p className="rounded-md bg-muted px-4 py-2 font-mono text-2xl font-semibold tracking-wider">
          {created.code}
        </p>
        <Button type="button" onClick={reset}>Registrar outro problema</Button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-xl border bg-card p-5 sm:p-6" noValidate>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold">Qual é o problema?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => {
            const { label, icon: Icon } = CATEGORY_META[c]
            const active = category === c
            const isOther = c === 'outro'
            return (
              <label
                key={c}
                className={cn(
                  'flex cursor-pointer gap-2 rounded-lg border p-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  isOther ? 'col-span-2 flex-row items-center sm:col-span-3' : 'flex-col',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-foreground/40',
                )}
              >
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={active}
                  onChange={() => setCategory(c)}
                  className="sr-only"
                />
                <Icon className="size-5" aria-hidden />
                <span className="font-medium leading-snug">{label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-semibold">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder={
            category === 'outro'
              ? 'Descreva o problema com detalhes, já que ele não está na lista acima.'
              : 'Ex.: O computador da bancada 5 não liga desde ontem.'
          }
          className={cn(inputClass, 'resize-y leading-relaxed')}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          <MapPin className="size-4" aria-hidden />
          Localização
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="building" className="text-xs text-muted-foreground">
              Local / bloco
            </label>
            <input
              id="building"
              name="building"
              required
              maxLength={80}
              placeholder="Ex.: Bloco A, estacionamento, quadra ou cantina"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="room" className="text-xs text-muted-foreground">
              Sala ou local exato
            </label>
            <input
              id="room"
              name="room"
              required
              maxLength={80}
              placeholder="Ex.: Sala 204, banheiro térreo"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Prioridade</legend>
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {PRIORITIES.map((p) => (
            <label
              key={p}
              className={cn(
                'cursor-pointer rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                priority === p
                  ? p === 'alta'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={priority === p}
                onChange={() => setPriority(p)}
                className="sr-only"
              />
              {PRIORITY_LABEL[p]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">
          Fotos <span className="font-normal text-muted-foreground">(opcional, até {MAX_PHOTOS})</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative size-20 overflow-hidden rounded-md border">
              <img src={src || '/placeholder.svg'} alt={`Foto anexada ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-foreground/80 text-background"
                aria-label={`Remover foto ${i + 1}`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
              <ImagePlus className="size-5" aria-hidden />
              Adicionar
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reporterName" className="text-sm font-semibold">
          Seu nome <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input id="reporterName" name="reporterName" maxLength={80} placeholder="Anônimo" className={inputClass} />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto sm:self-start">
        {submitting ? 'Enviando...' : 'Enviar chamado'}
      </Button>
    </form>
  )
}
