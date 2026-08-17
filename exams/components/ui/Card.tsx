import { cn } from "@/lib/utils";

/**
 * Surfaces declare elevation once: a hairline border or a shadow, never both.
 * "flat" is the default because an Operate surface wants calm planes, and
 * shadows are reserved for things that genuinely sit above the page.
 */
export function Card({
  children,
  className,
  variant = "flat",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "flat" | "raised";
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface",
        variant === "flat" ? "border border-line" : "shadow-card",
        padded && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[0.9375rem] font-semibold leading-tight text-dark">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-dark-400">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * A single instrument cluster rather than a row of identical floating cards.
 * One bordered panel, divided by hairlines, so the numbers read as one set of
 * related readings instead of five competing hero metrics.
 */
export function MetricRibbon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
      {children}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
  icon,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  /** Marks the one reading that matters most on this screen. */
  emphasis?: boolean;
}) {
  return (
    <div className={cn("p-4 lg:p-5", emphasis && "bg-gold-50/60")}>
      <div className="flex items-center gap-2">
        {icon ? (
          <span className={cn("shrink-0", emphasis ? "text-gold-700" : "text-dark-300")}>
            {icon}
          </span>
        ) : null}
        <p className="text-[0.8125rem] font-medium text-dark-500">{label}</p>
      </div>
      <p
        className={cn(
          "tnum mt-2 text-[1.75rem] font-semibold leading-none tracking-display",
          emphasis ? "text-gold-700" : "text-dark"
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs leading-snug text-dark-400">{hint}</p> : null}
    </div>
  );
}

/** Standalone reading, for screens that show four or fewer figures. */
export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        {icon ? <span className="shrink-0 text-dark-300">{icon}</span> : null}
        <p className="text-[0.8125rem] font-medium text-dark-500">{label}</p>
      </div>
      <p className="tnum mt-2 text-[1.75rem] font-semibold leading-none tracking-display text-dark">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs leading-snug text-dark-400">{hint}</p> : null}
    </div>
  );
}

/**
 * Section heading used inside a page body. More space above than below, so the
 * heading binds to what follows it rather than floating between blocks.
 */
export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 mt-10 flex items-end justify-between gap-4 first:mt-0">
      <div>
        <h2 className="text-[0.9375rem] font-semibold leading-tight text-dark">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-dark-400">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
