import { Suspense } from "react";
import { ShieldCheck, Timer, BarChart3 } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in" };

// Stated plainly rather than sold. This is an internal tool, and the people
// signing in already know what it is.
const POINTS = [
  {
    icon: ShieldCheck,
    title: "Answers stay server side",
    body: "The key is never sent to your device until you submit.",
  },
  {
    icon: Timer,
    title: "Server authoritative timer",
    body: "Your remaining time is unaffected by the device clock.",
  },
  {
    icon: BarChart3,
    title: "Topic level reporting",
    body: "Every attempt feeds your subject and topic breakdown.",
  },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      {/* Brand side. Hidden on small screens, where the form is the whole job. */}
      <section className="shell-dark relative hidden flex-col justify-between p-10 lg:flex xl:p-14">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold">
          WindChasers Aviation Academy
        </p>

        <div className="max-w-lg">
          <h1 className="text-[2.625rem] font-semibold leading-[1.08] tracking-display text-white xl:text-[3.25rem]">
            Ground school testing,
            <span className="block text-gold">measured properly.</span>
          </h1>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-dark-200">
            The internal examination and question bank platform for DGCA ground school.
            Timed papers, automatic scoring, and reporting down to the topic.
          </p>

          <ul className="mt-10 space-y-5">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-3.5">
                <point.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-white">{point.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-dark-300">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[0.6875rem] text-dark-300">
          Internal use only. Accounts are created by an administrator.
        </p>
      </section>

      {/* Form side */}
      <section className="flex items-center justify-center bg-canvas px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-700">
              WindChasers Aviation Academy
            </p>
          </div>

          <h2 className="text-[1.5rem] font-semibold tracking-display text-dark">Sign in</h2>
          <p className="mt-1.5 text-sm text-dark-400">
            Use the email your instructor registered for you.
          </p>

          <div className="mt-7">
            <Suspense fallback={<p className="text-sm text-dark-400">Loading</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-[0.8125rem] leading-relaxed text-dark-400">
            Cannot sign in? Contact your instructor. There is no public sign up.
          </p>
        </div>
      </section>
    </main>
  );
}
