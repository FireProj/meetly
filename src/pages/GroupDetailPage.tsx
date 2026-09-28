import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { createEvent, listenToGroupEvents, updateEventStatus } from '../lib/firestore'
import type { Group, GroupEvent } from '../types'
import EventCard from '../components/EventCard'

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const { user } = useAuth()
  const [group, setGroup] = useState<Group | null>(null)
  const [events, setEvents] = useState<GroupEvent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (!groupId) return
    getDoc(doc(db, 'groups', groupId)).then((snap) => {
      if (snap.exists()) setGroup({ id: snap.id, ...snap.data() } as Group)
    })
    return listenToGroupEvents(groupId, setEvents)
  }, [groupId])

  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault()
    if (!groupId || !user || !title.trim() || !date) return
    await createEvent(groupId, { title: title.trim(), description, date }, user.uid)
    setTitle('')
    setDescription('')
    setDate('')
    setShowForm(false)
  }

  if (!group) return <div className="p-6 text-sm text-gray-400">Caricamento...</div>

  return (
    <main className="max-w-md mx-auto px-4 py-6 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-brand-700">{group.name}</h1>
        <p className="text-xs text-gray-400">
          Codice invito: {group.inviteCode} · {group.members.length} membri
        </p>
      </header>

      <button
        onClick={() => setShowForm((v) => !v)}
        className="mb-4 w-full rounded-xl bg-brand-600 py-2 text-sm font-medium text-white shadow-sm"
      >
        + Proponi un'uscita
      </button>

      {showForm && (
        <form
          onSubmit={handleCreateEvent}
          className="mb-6 space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cosa si fa?"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dettagli (opzionale)"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button type="submit" className="w-full rounded-xl bg-brand-600 py-2 text-sm font-medium text-white">
            Pubblica proposta
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} onConfirm={() => updateEventStatus(ev.groupId, ev.id, 'confermato')} />
        ))}
        {events.length === 0 && (
          <p className="mt-8 text-center text-sm text-gray-400">Nessuna proposta ancora. Proponi la prima uscita!</p>
        )}
      </ul>
    </main>
  )
}
