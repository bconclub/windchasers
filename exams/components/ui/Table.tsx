import { cn } from "@/lib/utils";

/**
 * `bare` drops the outer frame for tables that already sit inside a Card, so
 * elevation is never declared twice on the same edge.
 */
export function Table({
  children,
  className,
  bare = false,
}: {
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto",
        !bare && "rounded-xl border border-line bg-surface"
      )}
    >
      <table className={cn("w-full border-collapse text-sm", className)}>{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-line bg-dark-50/60 px-4 py-2.5 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-dark-400",
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "border-b border-line px-4 py-3 align-middle text-[0.8125rem] text-dark-600",
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dark-200 bg-surface px-6 py-14 text-center">
      {icon ? <div className="mb-4 text-dark-300">{icon}</div> : null}
      <p className="text-[0.9375rem] font-semibold text-dark">{title}</p>
      {message ? (
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-dark-400">{message}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (next: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="tnum text-[0.8125rem] text-dark-400">
        {from} to {to} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-dark-600 transition-colors duration-feedback ease-out hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="tnum px-2 text-[0.8125rem] text-dark-400">
          {page} of {pages}
        </span>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-dark-600 transition-colors duration-feedback ease-out hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
