import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dark-100">
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
        "border-b border-dark-100 bg-dark-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-dark-500",
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
    <td className={cn("border-b border-dark-100 px-3 py-2 align-top text-dark", className)} {...rest}>
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
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-dark-100 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-dark-300">{icon}</div> : null}
      <p className="text-sm font-medium text-dark">{title}</p>
      {message ? <p className="mt-1 max-w-md text-sm text-dark-400">{message}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
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
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm text-dark-400">
      <span>
        {from} to {to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded border border-dark-100 px-3 py-1 text-dark hover:bg-dark-50 disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-dark">
          {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded border border-dark-100 px-3 py-1 text-dark hover:bg-dark-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
