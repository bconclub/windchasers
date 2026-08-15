import { cn } from "@/lib/utils";

type Tone = "neutral" | "gold" | "success" | "danger" | "warning" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-dark-50 text-dark-500 border-dark-100",
  gold: "bg-gold-50 text-gold-700 border-gold-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  dark: "bg-dark text-white border-dark",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusTones: Record<string, Tone> = {
  draft: "neutral",
  active: "success",
  archived: "neutral",
  published: "success",
  closed: "danger",
  in_progress: "warning",
  submitted: "success",
  auto_submitted: "warning",
  expired: "danger",
  easy: "success",
  medium: "warning",
  hard: "danger",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge tone={statusTones[value] ?? "neutral"}>{value.replace(/_/g, " ")}</Badge>
  );
}
