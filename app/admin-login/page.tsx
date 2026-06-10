"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// On-site admin sign-in — replaces the browser's native Basic-auth popup.
// Posts to /api/admin/login which sets the session cookie the middleware
// checks for everything under /admin.
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Sign in failed. Try again.");
        setBusy(false);
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl p-8"
    >
      <div className="mb-7">
        <span className="text-gold font-bold tracking-[0.18em] text-xs uppercase block">
          WindChasers
        </span>
        <h1 className="text-white text-xl font-semibold mt-1">Admin sign in</h1>
      </div>

      <label className="block mb-4">
        <span className="block text-xs text-white/50 mb-1.5">Username</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
          required
          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-gold/60 transition-colors"
        />
      </label>

      <label className="block mb-5">
        <span className="block text-xs text-white/50 mb-1.5">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-gold/60 transition-colors"
        />
      </label>

      {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-lg bg-gold text-dark font-bold hover:bg-gold/90 transition-colors disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
