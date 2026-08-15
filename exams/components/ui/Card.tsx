import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-dark-100 bg-white p-5", className)}>
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
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-dark">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-dark-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

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
    <div className="rounded-lg border border-dark-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-dark-400">{label}</p>
        {icon ? <span className="text-gold">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-dark">{value}</p>
      {hint ? <p className="mt-1 text-xs text-dark-400">{hint}</p> : null}
    </div>
  );
}
