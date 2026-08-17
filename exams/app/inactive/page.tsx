import Image from "next/image";
import { ShieldAlert } from "lucide-react";
import { InactiveSignOut } from "./InactiveSignOut";

export const metadata = { title: "Account inactive" };

export default function InactivePage() {
  return (
    <main className="shell-dark flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Image
          src="/brand/windchasers-logo.png"
          alt="WindChasers Aviation Academy"
          width={500}
          height={134}
          className="mx-auto h-9 w-auto"
          priority
        />

        <div className="mt-8 rounded-2xl border border-line bg-surface p-8">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-warning-soft text-warning-ink">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-[1.25rem] font-semibold tracking-display text-dark">
            Account inactive
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-dark-400">
            Your account has been deactivated, or it has not been set up yet. Contact your
            instructor or the academy office to have it enabled.
          </p>
          <div className="mt-6">
            <InactiveSignOut />
          </div>
        </div>
      </div>
    </main>
  );
}
