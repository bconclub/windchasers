import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in" };

/**
 * Two front doors, one door frame.
 *
 * Both submit the same Supabase session and the route middleware sends each
 * person to their real home from their profile role, so a student who follows
 * the instructor link still lands on their dashboard rather than hitting a
 * wrong door error. There is no second auth path to keep secure.
 */
type Door = "student" | "staff";

const DOORS: Record<Door, { label: string; icon: typeof GraduationCap; heading: string; hint: string; footer: string }> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    heading: "Student sign in",
    hint: "Use the email your instructor registered for you.",
    footer: "Cannot sign in? Contact your instructor. There is no public sign up.",
  },
  staff: {
    label: "Instructor",
    icon: Users,
    heading: "Instructor sign in",
    hint: "Use your academy email address.",
    footer: "Instructor and admin accounts are created by an administrator.",
  },
};

export default function LoginPage({ searchParams }: { searchParams: { as?: string } }) {
  const door: Door = searchParams.as === "staff" ? "staff" : "student";
  const copy = DOORS[door];

  return (
    <main className="shell-dark flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[26rem]">
        <div className="rounded-2xl bg-surface p-7 shadow-card sm:p-8">
          <div
            role="tablist"
            aria-label="Who is signing in"
            className="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-line bg-dark-50 p-1"
          >
            {(Object.keys(DOORS) as Door[]).map((key) => {
              const item = DOORS[key];
              const active = key === door;
              return (
                <Link
                  key={key}
                  href={`/login?as=${key}`}
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    "flex h-10 items-center justify-center gap-2 rounded-lg text-[0.8125rem] font-medium transition-colors duration-feedback ease-out",
                    active ? "bg-surface text-dark shadow-card" : "text-dark-500 hover:text-dark"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <h1 className="text-[1.375rem] font-semibold tracking-display text-dark">
            {copy.heading}
          </h1>
          <p className="mt-1.5 text-sm text-dark-400">{copy.hint}</p>

          <div className="mt-6">
            <Suspense fallback={<p className="text-sm text-dark-400">Loading</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-7 text-[0.8125rem] leading-relaxed text-dark-400">{copy.footer}</p>
        </div>

        {/* Small mark at the foot, so the brand signs the page without competing
            with the one thing the visitor came here to do. */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <Image
            src="/brand/windchasers-logo.png"
            alt="WindChasers Aviation Academy"
            width={500}
            height={134}
            className="h-6 w-auto opacity-80"
            priority
          />
          <p className="text-[0.6875rem] text-dark-300">Internal use only</p>
        </div>
      </div>
    </main>
  );
}
