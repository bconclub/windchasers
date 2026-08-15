import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            WindChasers Aviation Academy
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Exam Platform</h1>
          <p className="mt-1 text-sm text-dark-300">Sign in to continue</p>
        </div>
        <div className="rounded-lg bg-white p-6">
          <Suspense fallback={<p className="text-sm text-dark-400">Loading</p>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-dark-400">
          Internal use only. Contact your instructor if you cannot sign in.
        </p>
      </div>
    </main>
  );
}
