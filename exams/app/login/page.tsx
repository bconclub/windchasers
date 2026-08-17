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
 *
 * The brand side is deliberately bare. This is an internal tool for people who
 * already know what it is, so it states who the door is for and nothing else.
 */
type Door = "student" | "staff";

const DOORS: Record<Door, { label: string; icon: typeof GraduationCap; forWhom: string; hint: string; footer: string }> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    forWhom: "for students",
    hint: "Use the email your instructor registered for you.",
    footer: "Cannot sign in? Contact your instructor. There is no public sign up.",
  },
  staff: {
    label: "Instructor",
    icon: Users,
    forWhom: "for instructors",
    hint: "Use your academy email address.",
    footer: "Instructor and admin accounts are created by an administrator.",
  },
};

export default function LoginPage({ searchParams }: { searchParams: { as?: string } }) {
  const door: Door = searchParams.as === "staff" ? "staff" : "student";
  const copy = DOORS[door];

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
      {/* Brand side: the mark, and who the door is for. Nothing else. */}
      <section className="shell-dark relative hidden items-center justify-center p-12 lg:flex">
        <div className="w-full max-w-xl">
          <Image
            src="/brand/windchasers-logo.png"
            alt="WindChasers Aviation Academy"
            width={500}
            height={134}
            className="h-auto w-full max-w-[30rem]"
            priority
          />
          <p className="mt-8 text-[1.75rem] font-light leading-none tracking-display text-dark-200">
            {copy.forWhom}
          </p>
        </div>

        <p className="absolute inset-x-12 bottom-10 text-[0.6875rem] text-dark-300">
          Internal use only. Accounts are created by an administrator.
        </p>
      </section>

      {/* Form side */}
      <section className="flex items-center justify-center bg-canvas px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Image
            src="/brand/windchasers-logo.png"
            alt="WindChasers Aviation Academy"
            width={500}
            height={134}
            className="mb-8 h-9 w-auto lg:hidden"
            priority
          />

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
                    "flex h-11 items-center justify-center gap-2 rounded-lg text-[0.8125rem] font-medium transition-colors duration-feedback ease-out",
                    active ? "bg-surface text-dark shadow-card" : "text-dark-500 hover:text-dark"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <h1 className="text-[1.5rem] font-semibold tracking-display text-dark">
            {door === "staff" ? "Instructor sign in" : "Student sign in"}
          </h1>
          <p className="mt-1.5 text-sm text-dark-400">{copy.hint}</p>

          <div className="mt-7">
            <Suspense fallback={<p className="text-sm text-dark-400">Loading</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-[0.8125rem] leading-relaxed text-dark-400">{copy.footer}</p>
        </div>
      </section>
    </main>
  );
}
