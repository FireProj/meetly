import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { castVote, listenToVotes } from '../lib/firestore'
import type { GroupEvent, Vote, VoteResponse } from '../types'

const statusStyles: Record<GroupEvent['status'], string> = {
  proposto: 'bg-amber-50 text-amber-600',
  confermato: 'bg-emerald-50 text-emerald-600',
  annullato: 'bg-gray-100 text-gray-400',
}

const statusLabels: Record<GroupEvent['status'], string> = {
  proposto: 'Proposto',
  confermato: 'Confermato',
  annullato: 'Annullato',
}

export default function EventCard({ event, onConfirm }: { event: GroupEvent; onConfirm: () => void }) {
  const { user } = useAuth()
  const [votes, setVotes] = useState<Vote[]>([])

  useEffect(() => listenToVotes(event.groupId, event.id, setVotes), [event.groupId, event.id])

  const myVote = votes.find((v) => v.uid === user?.uid)
  const counts = {
    si: votes.filter((v) => v.response === 'si').length,
    forse: votes.filter((v) => v.response === 'forse').length,
    no: votes.filter((v) => v.response === 'no').length,
  }

  const vote = (response: VoteResponse) => {
    if (!user) return
    castVote(event.groupId, event.id, user.uid, user.displayName ?? user.email ?? 'Utente', response)
  }

  return (
    <li className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-800">{event.title}</p>
          <p className="text-xs text-gray-400">
            {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[event.status]}`}>
          {statusLabels[event.status]}
        </span>
      </div>

      {event.description && <p className="mb-3 text-sm text-gray-600">{event.description}</p>}

      <div className="mb-3 flex gap-2">
        {(['si', 'forse', 'no'] as VoteResponse[]).map((r) => (
          <button
            key={r}
            onClick={() => vote(r)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
              myVote?.response === r ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-500'
            }`}
          >
            {r === 'si' ? `Sì (${counts.si})` : r === 'forse' ? `Forse (${counts.forse})` : `No (${counts.no})`}
          </button>
        ))}
      </div>

      {event.status === 'proposto' && (
        <button
          onClick={onConfirm}
          className="w-full rounded-lg border border-brand-600 py-1.5 text-xs font-medium text-brand-600"
        >
          Confermo l'uscita
        </button>
      )}
    </li>
  )
}
