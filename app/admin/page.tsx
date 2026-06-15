import Link from "next/link";

export const metadata = {
  title: "Admin · Overview",
};

const CARDS = [
  {
    href: "/admin/flight-schools",
    title: "Flight Schools",
    desc: "Review, verify and pick which schools show on the site.",
    status: "Live",
  },
  {
    href: "/admin/events",
    title: "Events",
    desc: "Manage events shown on the site.",
    status: "Scaffold",
  },
  {
    href: "/admin/payments",
    title: "Payments",
    desc: "Create and share payment links.",
    status: "Scaffold",
  },
];

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Overview</h1>
      <p className="text-white/55 text-sm mb-6">
        Manage what the public site runs on.
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
              Open
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
