import { cn } from "@/lib/utils";

type Tone = "neutral" | "gold" | "success" | "danger" | "warning" | "dark";

// Semantic fills tinted from their own hue, never gray text on a colour.
const tones: Record<Tone, string> = {
  neutral: "bg-dark-50 text-dark-500 border-line",
  gold: "bg-gold-50 text-gold-700 border-gold-200",
  success: "bg-success-soft text-success-ink border-success/20",
  danger: "bg-danger-soft text-danger-ink border-danger/20",
  warning: "bg-warning-soft text-warning-ink border-warning/25",
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
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize",
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
