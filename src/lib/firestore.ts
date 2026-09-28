import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Group, GroupEvent, Vote, VoteResponse } from '../types'

function generateInviteCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createGroup(name: string, uid: string, description?: string) {
  const inviteCode = generateInviteCode()
  const ref = await addDoc(collection(db, 'groups'), {
    name,
    description: description ?? '',
    members: [uid],
    createdBy: uid,
    inviteCode,
    createdAt: Date.now(),
  })
  return { id: ref.id, inviteCode }
}

export async function joinGroupByCode(inviteCode: string, uid: string) {
  const q = query(collection(db, 'groups'), where('inviteCode', '==', inviteCode.toUpperCase()))
  const snapshot = await getDocs(q)
  if (snapshot.empty) throw new Error('Codice invito non valido')

  const groupDoc = snapshot.docs[0]
  const members: string[] = groupDoc.data().members ?? []
  if (!members.includes(uid)) {
    await updateDoc(groupDoc.ref, { members: [...members, uid] })
  }
  return groupDoc.id
}

export function listenToUserGroups(uid: string, callback: (groups: Group[]) => void): Unsubscribe {
  const q = query(collection(db, 'groups'), where('members', 'array-contains', uid))
  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Group)
    callback(groups)
  })
}

export async function createEvent(
  groupId: string,
  data: { title: string; description?: string; date: string },
  uid: string,
) {
  const ref = await addDoc(collection(db, 'groups', groupId, 'events'), {
    title: data.title,
    description: data.description ?? '',
    date: data.date,
    status: 'proposto',
    createdBy: uid,
    createdAt: Date.now(),
  })
  return ref.id
}

export function listenToGroupEvents(
  groupId: string,
  callback: (events: GroupEvent[]) => void,
): Unsubscribe {
  const q = query(collection(db, 'groups', groupId, 'events'), orderBy('date', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(
      (d) => ({ id: d.id, groupId, ...d.data() }) as GroupEvent,
    )
    callback(events)
  })
}

export async function updateEventStatus(groupId: string, eventId: string, status: GroupEvent['status']) {
  await updateDoc(doc(db, 'groups', groupId, 'events', eventId), { status })
}

export async function castVote(
  groupId: string,
  eventId: string,
  uid: string,
  displayName: string,
  response: VoteResponse,
) {
  await setDoc(doc(db, 'groups', groupId, 'events', eventId, 'votes', uid), {
    uid,
    displayName,
    response,
    votedAt: serverTimestamp(),
  })
}

export function listenToVotes(
  groupId: string,
  eventId: string,
  callback: (votes: Vote[]) => void,
): Unsubscribe {
  const ref = collection(db, 'groups', groupId, 'events', eventId, 'votes')
  return onSnapshot(ref, (snapshot) => {
    const votes = snapshot.docs.map((d) => d.data() as Vote)
    callback(votes)
  })
}
