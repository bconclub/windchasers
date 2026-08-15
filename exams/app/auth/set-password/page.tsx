import { SetPasswordForm } from "./SetPasswordForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Set password" };

export default function SetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            WindChasers Aviation Academy
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Set your password</h1>
          <p className="mt-1 text-sm text-dark-300">
            Choose a password to finish setting up your account
          </p>
        </div>
        <div className="rounded-lg bg-white p-6">
          <SetPasswordForm />
        </div>
      </div>
    </main>
  );
}
