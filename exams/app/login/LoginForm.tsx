"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, KeyRound } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { errorMessage } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("reason") === "session_replaced"
      ? "This account was signed in on another device. Only one session can be open at a time."
      : null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;
      // Pin this session as the account's active one, retiring any other.
      const { error: claimError } = await supabase.rpc("claim_active_session");
      if (claimError) throw claimError;
      router.replace(next && next.startsWith("/") ? next : "/");
      router.refresh();
    } catch (caught) {
      setError(errorMessage(caught, "Could not sign in"));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(): Promise<void> {
    if (!email.trim()) {
      setError("Enter your email first, then request a reset link");
      return;
    }
    setError(null);
    setNotice(null);
    setResetting(true);
    try {
      const supabase = getBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (resetError) throw resetError;
      setNotice("Reset link sent. Check your email.");
    } catch (caught) {
      setError(errorMessage(caught, "Could not send the reset link"));
    } finally {
      setResetting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@windchasers.in"
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}

      <Button type="submit" loading={loading} className="w-full">
        <LogIn className="h-4 w-4" />
        Sign in
      </Button>

      <button
        type="button"
        onClick={handleReset}
        disabled={resetting}
        className="flex w-full items-center justify-center gap-1.5 text-xs text-dark-400 hover:text-dark disabled:opacity-60"
      >
        <KeyRound className="h-3.5 w-3.5" />
        {resetting ? "Sending reset link" : "Forgot password"}
      </button>
    </form>
  );
}
