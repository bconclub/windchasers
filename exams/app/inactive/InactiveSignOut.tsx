"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

/**
 * The shell's SignOutButton is styled for the dark rail. This page sits on a
 * light card, so it uses the standard Button instead of inheriting rail colours
 * that would be invisible here.
 */
export function InactiveSignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut(): Promise<void> {
    setLoading(true);
    await getBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleSignOut} loading={loading}>
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
