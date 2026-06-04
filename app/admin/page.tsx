import Link from "next/link";

export const metadata = {
  title: "Admin · Overview",
};

const CARDS = [
  {
    href: "/admin/flight-schools",
    title: "Flight Schools",
    desc: "The international flight-school directory powering /flight-schools — review, verify, mark partners, edit scores.",
    status: "Live",
  },
  {
    href: "/admin/events",
    title: "Events",
    desc: "Manage the events shown on the homepage and the webinar/open-house pages — date, registration open/closed, clips.",
    status: "Scaffold",
  },
  {
    href: "/admin/payments",
    title: "Payments",
    desc: "Create and share payment links (deposits, demo fees, program fees) and track their status.",
    status: "Scaffold",
  },
];

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Overview</h1>
      <p className="text-white/55 text-sm mb-6">
        Manage everything the public site runs on — leads, events, payments and the
        flight-school directory.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block rounded-xl border border-white/10 bg-[#141414] p-5 hover:border-gold/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-white">{c.title}</h2>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  c.status === "Live"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {c.status}
              </span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">{c.desc}</p>
            <span className="mt-3 inline-block text-sm text-gold group-hover:translate-x-0.5 transition-transform">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-[#101010] p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-2">Roadmap / to wire up</h3>
        <ul className="text-sm text-white/50 space-y-1.5 list-disc pl-5">
          <li>Events: persist to a DB/API so edits don&apos;t require a code deploy.</li>
          <li>Payments: connect a provider (Razorpay / Stripe payment links) + webhook to track paid status.</li>
          <li>Leads: a read-only view of PROXe / Sheets submissions across all forms.</li>
        </ul>
      </div>
    </div>
  );
}
