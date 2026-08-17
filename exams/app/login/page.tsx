import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck, Timer, BarChart3, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in" };

/**
 * Two front doors, one door frame.
 *
 * Students and staff see their own heading and their own supporting points,
 * but both submit to the same Supabase session and the route middleware sends
 * each person to their real home based on their profile role. That means a
 * student who follows the instructor link still lands on their dashboard
 * rather than hitting a wrong door error, and there is no second auth path to
 * keep secure.
 */
type Door = "student" | "staff";

const DOORS: Record<
  Door,
  {
    label: string;
    icon: typeof GraduationCap;
    heading: string;
    accent: string;
    blurb: string;
    hint: string;
    points: Array<{ icon: typeof ShieldCheck; title: string; body: string }>;
  }
> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    heading: "Find the gap",
    accent: "before the examiner does.",
    blurb:
      "Sit your assigned papers under exam conditions, then see exactly which topics cost you marks.",
    hint: "Use the email your instructor registered for you.",
    points: [
      {
        icon: Timer,
        title: "The clock is the server's",
        body: "Your remaining time is unaffected by your device, and a dropped connection does not cost you the paper.",
      },
      {
        icon: BarChart3,
        title: "Named weak topics",
        body: "Not just a score. The three topics costing you the most marks, by name.",
      },
      {
        icon: ShieldCheck,
        title: "Answers stay sealed",
        body: "The key never reaches your device until you submit.",
      },
    ],
  },
  staff: {
    label: "Instructor",
    icon: Users,
    heading: "Every mark,",
    accent: "accounted for.",
    blurb:
      "Build papers from the bank, assign them to a batch, and read the result down to the individual question.",
    hint: "Use your academy email address.",
    points: [
      {
        icon: BarChart3,
        title: "Question level analytics",
        body: "Percent correct and the most picked wrong option, so a bad question surfaces before the next batch sits it.",
      },
      {
        icon: Timer,
        title: "Papers in minutes",
        body: "Write a blueprint by subject and difficulty, and let the bank fill it.",
      },
      {
        icon: ShieldCheck,
        title: "Scoring you can defend",
        body: "Marking happens in the database. A tampered client cannot produce a false score.",
      },
    ],
  },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { as?: string };
}) {
  const door: Door = searchParams.as === "staff" ? "staff" : "student";
  const copy = DOORS[door];

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      <section className="shell-dark relative hidden flex-col justify-between p-10 lg:flex xl:p-14">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold">
          WindChasers Aviation Academy
        </p>

        <div className="max-w-lg">
          <h1 className="text-[2.625rem] font-semibold leading-[1.06] tracking-display text-white xl:text-[3.25rem]">
            {copy.heading}
            <span className="block text-gold">{copy.accent}</span>
          </h1>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-dark-200">
            {copy.blurb}
          </p>

          <ul className="mt-10 space-y-5">
            {copy.points.map((point) => (
              <li key={point.title} className="flex gap-3.5">
                <point.icon className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-white">{point.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-dark-300">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[0.6875rem] text-dark-300">
          Internal use only. Accounts are created by an administrator.
        </p>
      </section>

      <section className="flex items-center justify-center bg-canvas px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="mb-7 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-700 lg:hidden">
            WindChasers Aviation Academy
          </p>

          {/* Both doors reach the same session. The label sets expectations, it
              does not gate anything. */}
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
                    active
                      ? "bg-surface text-dark shadow-card"
                      : "text-dark-500 hover:text-dark"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <h2 className="text-[1.5rem] font-semibold tracking-display text-dark">
            {door === "staff" ? "Instructor sign in" : "Student sign in"}
          </h2>
          <p className="mt-1.5 text-sm text-dark-400">{copy.hint}</p>

          <div className="mt-7">
            <Suspense fallback={<p className="text-sm text-dark-400">Loading</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-[0.8125rem] leading-relaxed text-dark-400">
            {door === "staff"
              ? "Instructor and admin accounts are created by an administrator."
              : "Cannot sign in? Contact your instructor. There is no public sign up."}
          </p>
        </div>
      </section>
    </main>
  );
}
