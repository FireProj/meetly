import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createGroup, joinGroupByCode, listenToUserGroups } from '../lib/firestore'
import type { Group } from '../types'

export default function GroupsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState<Group[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    return listenToUserGroups(user.uid, setGroups)
  }, [user])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !name.trim()) return
    const { id } = await createGroup(name.trim(), user.uid)
    setName('')
    setShowCreate(false)
    navigate(`/groups/${id}`)
  }

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !code.trim()) return
    try {
      const id = await joinGroupByCode(code.trim(), user.uid)
      setCode('')
      setShowJoin(false)
      navigate(`/groups/${id}`)
    } catch {
      setError('Codice invito non valido')
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-6 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">I tuoi gruppi</h1>
          <p className="text-sm text-gray-500">Ciao {user?.displayName ?? user?.email}</p>
        </div>
        <button onClick={signOut} className="text-xs text-gray-400 underline">
          Esci
        </button>
      </header>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex-1 rounded-xl bg-brand-600 py-2 text-sm font-medium text-white shadow-sm"
        >
          + Nuovo gruppo
        </button>
        <button
          onClick={() => setShowJoin((v) => !v)}
          className="flex-1 rounded-xl border border-brand-600 py-2 text-sm font-medium text-brand-600"
        >
          Unisciti con codice
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome del gruppo"
            required
            className="mb-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button type="submit" className="w-full rounded-xl bg-brand-600 py-2 text-sm font-medium text-white">
            Crea gruppo
          </button>
        </form>
      )}

      {showJoin && (
        <form onSubmit={handleJoin} className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Codice invito"
            required
            className="mb-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm uppercase tracking-widest focus:border-brand-500 focus:outline-none"
          />
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-brand-600 py-2 text-sm font-medium text-white">
            Entra nel gruppo
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {groups.map((g) => (
          <li key={g.id}>
            <Link
              to={`/groups/${g.id}`}
              className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:scale-[0.99]"
            >
              <p className="font-medium text-gray-800">{g.name}</p>
              <p className="text-xs text-gray-400">{g.members.length} membri · codice {g.inviteCode}</p>
            </Link>
          </li>
        ))}
        {groups.length === 0 && (
          <p className="mt-8 text-center text-sm text-gray-400">
            Nessun gruppo ancora. Creane uno o unisciti con un codice.
          </p>
        )}
      </ul>
    </main>
  )
}
