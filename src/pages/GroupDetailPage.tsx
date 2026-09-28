import { Link, useParams } from "react-router-dom";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/groups"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Torna ai gruppi
        </Link>

        <header className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Gruppo
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Dettaglio gruppo
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            ID gruppo: {groupId ?? "non disponibile"}
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            📅
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Le proposte arriveranno qui
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Questo è un placeholder. Qui inseriremo calendario, proposte di
            uscita e sondaggio di partecipazione.
          </p>
        </section>
      </div>
    </main>
  );
}
