export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  createdAt: number
}

export interface Group {
  id: string
  name: string
  description?: string
  members: string[]
  createdBy: string
  inviteCode: string
  createdAt: number
}

export type EventStatus = 'proposto' | 'confermato' | 'annullato'

export interface GroupEvent {
  id: string
  groupId: string
  title: string
  description?: string
  date: string // ISO date string, es. 2026-10-04
  status: EventStatus
  createdBy: string
  createdAt: number
}

export type VoteResponse = 'si' | 'no' | 'forse'

export interface Vote {
  uid: string
  displayName: string
  response: VoteResponse
  votedAt: number
}
