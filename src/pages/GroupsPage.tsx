export default function GroupsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Meetly
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            I tuoi gruppi
          </h1>
          <p className="mt-2 text-slate-500">
            Qui potrai vedere e gestire i gruppi dei tuoi amici.
          </p>
        </header>

        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            +
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Nessun gruppo da mostrare
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Questo è un placeholder. Qui aggiungeremo la creazione dei gruppi e
            l&apos;ingresso tramite codice invito.
          </p>
        </section>
      </div>
    </main>
  );
}
