"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function SignOutButton({ variant = "onDark" }: { variant?: "ghost" | "secondary" | "onDark" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut(): Promise<void> {
    setLoading(true);
    await getBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant={variant} size="sm" onClick={handleSignOut} loading={loading}>
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
