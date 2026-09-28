# Schema Firestore - Meetly

## `users/{uid}`

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| displayName | string | Nome visualizzato |
| email | string | Email account |
| photoURL | string? | Foto profilo |
| createdAt | number | Timestamp creazione |

## `groups/{groupId}`

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| name | string | Nome del gruppo |
| description | string | Descrizione opzionale |
| members | string[] | Array di uid dei membri |
| createdBy | string | uid del creatore |
| inviteCode | string | Codice invito (6 caratteri) |
| createdAt | number | Timestamp creazione |

## `groups/{groupId}/events/{eventId}`

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| title | string | Titolo della proposta di uscita |
| description | string | Dettagli |
| date | string | Data ISO (es. 2026-10-04) |
| status | 'proposto' \| 'confermato' \| 'annullato' | Stato dell'uscita |
| createdBy | string | uid del proponente |
| createdAt | number | Timestamp creazione |

## `groups/{groupId}/events/{eventId}/votes/{uid}`

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| uid | string | Id del votante |
| displayName | string | Nome del votante |
| response | 'si' \| 'no' \| 'forse' | Risposta al sondaggio |
| votedAt | timestamp | Momento del voto |

## Note sulle regole di sicurezza

- Solo i membri di un gruppo (`members` array) possono leggere/scrivere gruppo, eventi e voti.
- Ogni utente puo' scrivere solo il proprio documento voto (`request.auth.uid == voteId`).
- Solo il creatore di un gruppo o di un evento puo' eliminarlo.
