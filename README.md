# Meetly

App calendario mobile-first, gratuita, per organizzare le uscite tra amici: crea gruppi, invita membri, proponi un'uscita per una data, e vota chi partecipa con un sondaggio.

## Stack

- **Frontend:** React + TypeScript + Vite
- **Stile:** Tailwind CSS
- **Database & Auth:** Firebase (Firestore + Firebase Auth)
- **Hosting:** Firebase Hosting

## Setup locale

```bash
npm install
cp .env.example .env.local   # inserisci le chiavi del tuo progetto Firebase
npm run dev
```

## Deploy

```bash
npm run build
firebase deploy
```

## Funzionalità previste

- Gruppi di amici con inviti
- Calendario con selezione data
- Proposte di uscita con descrizione
- Sondaggio di partecipazione (chi viene / chi no)
- Vista riepilogo di cosa è confermato
