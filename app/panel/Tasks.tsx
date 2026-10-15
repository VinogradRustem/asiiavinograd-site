'use client'

import { useCallback, useEffect, useState } from 'react'

type Task = {
  id: string
  title: string
  notes: string | null
  assignee: 'asya' | 'rustem'
  done: boolean
  done_at: string | null
  created_at: string
}

const PEOPLE: { key: 'asya' | 'rustem'; name: string }[] = [
  { key: 'asya', name: 'Ася' },
  { key: 'rustem', name: 'Рустем' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState('')
  const [draft, setDraft] = useState<Record<string, string>>({ asya: '', rustem: '' })
  const [open, setOpen] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/panel/tasks', { cache: 'no-store' })
      if (!r.ok) throw new Error(String(r.status))
      setTasks((await r.json()).tasks || [])
      setErr('')
    } catch {
      setErr('Не удалось загрузить задачи')
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function add(who: 'asya' | 'rustem') {
    const title = draft[who].trim()
    if (!title) return
    setDraft(d => ({ ...d, [who]: '' }))
    const r = await fetch('/api/panel/tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, assignee: who }),
    })
    if (r.ok) { const { task } = await r.json(); setTasks(t => [...t, task]) } else setErr('Не удалось добавить задачу')
  }

  async function patch(id: string, body: Partial<Task>) {
    setTasks(t => t.map(x => (x.id === id ? { ...x, ...body } : x)))
    const r = await fetch(`/api/panel/tasks/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (!r.ok) { setErr('Не удалось сохранить'); load() }
  }

  async function remove(id: string) {
    if (!window.confirm('Удалить задачу?')) return
    setTasks(t => t.filter(x => x.id !== id))
    await fetch(`/api/panel/tasks/${id}`, { method: 'DELETE' })
  }

  return (
    <main className="pl-main">
      {err && <div className="pl-err" role="alert">{err}</div>}
      <div className="pl-tasks">
        {PEOPLE.map(p => {
          const mine = tasks.filter(t => t.assignee === p.key)
          const todo = mine.filter(t => !t.done)
          const done = mine.filter(t => t.done)
          return (
            <section key={p.key} className="pl-task-col">
              <header>
                <h2>{p.name}</h2>
                <span className="pl-count">{todo.length} осталось</span>
              </header>
              <form className="pl-task-add" onSubmit={e => { e.preventDefault(); add(p.key) }}>
                <input
                  value={draft[p.key]}
                  onChange={e => setDraft(d => ({ ...d, [p.key]: e.target.value }))}
                  placeholder="Новая задача"
                  aria-label={`Новая задача для: ${p.name}`}
                />
                <button type="submit" disabled={!draft[p.key].trim()}>Добавить</button>
              </form>
              {!loaded ? <p className="pl-empty">Загружаю…</p> : todo.length === 0 && <p className="pl-empty">Задач нет</p>}
              <ul>
                {[...todo, ...done].map(t => (
                  <li key={t.id} className={t.done ? 'done' : ''}>
                    <input type="checkbox" checked={t.done} onChange={e => patch(t.id, { done: e.target.checked })} aria-label="Готово" />
                    <div className="pl-task-body">
                      <button className="pl-task-title" onClick={() => setOpen(open === t.id ? null : t.id)}>{t.title}</button>
                      {t.notes && open !== t.id && <p className="pl-task-notes">{t.notes}</p>}
                      {open === t.id && (
                        <div className="pl-task-edit">
                          <textarea
                            defaultValue={t.notes || ''}
                            placeholder="Подробности"
                            rows={3}
                            onBlur={e => { if ((e.target.value || null) !== t.notes) patch(t.id, { notes: e.target.value || null }) }}
                          />
                          <div className="pl-task-actions">
                            <button onClick={() => patch(t.id, { assignee: p.key === 'asya' ? 'rustem' : 'asya' })}>
                              Передать: {p.key === 'asya' ? 'Рустем' : 'Ася'}
                            </button>
                            <button className="danger" onClick={() => remove(t.id)}>Удалить</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </main>
  )
}
