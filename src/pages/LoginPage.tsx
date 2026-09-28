import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegistering = mode === "register";

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isRegistering && password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    if (isRegistering && password.length < 6) {
      setError("La password deve contenere almeno 6 caratteri.");
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (authError) {
      const errorCode = (authError as { code?: string }).code;

      if (errorCode === "auth/email-already-in-use") {
        setError("Questa email è già registrata.");
      } else if (errorCode === "auth/invalid-credential") {
        setError("Email o password non valide.");
      } else if (errorCode === "auth/invalid-email") {
        setError("Inserisci un indirizzo email valido.");
      } else if (errorCode === "auth/weak-password") {
        setError("La password è troppo debole.");
      } else {
        setError("Si è verificato un errore. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
            M
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isRegistering ? "Crea il tuo account" : "Bentornato su Meetly"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isRegistering
              ? "Registrati per organizzare uscite con i tuoi amici."
              : "Accedi per organizzare la prossima uscita."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              !isRegistering
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Accedi
          </button>
          <button
            type="button"
            onClick={() => changeMode("register")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isRegistering
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Registrati
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@esempio.it"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Inserisci la password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {isRegistering && (
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Conferma password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Ripeti la password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          )}

          {error && (
            <p
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600"
              role="status"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isRegistering
                ? "Registrazione in corso..."
                : "Accesso in corso..."
              : isRegistering
                ? "Crea account"
                : "Accedi"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Organizza, vota e vivi le tue uscite insieme agli amici.
        </p>
      </section>
    </main>
  );
}
