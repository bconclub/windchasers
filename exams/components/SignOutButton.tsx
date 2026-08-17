"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut(): Promise<void> {
    setLoading(true);
    await getBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      title={collapsed ? "Sign out" : undefined}
      aria-label="Sign out"
      className={cn(
        "flex h-11 w-full items-center rounded-lg text-[0.8125rem] text-dark-200",
        "transition-colors duration-feedback ease-out hover:bg-white/10 hover:text-white",
        "disabled:cursor-not-allowed disabled:opacity-60",
        collapsed ? "justify-center px-0" : "gap-3 px-3"
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {!collapsed ? <span>{loading ? "Signing out" : "Sign out"}</span> : null}
    </button>
  );
}
