import { cn, formatUSD, formatPercent, getChangeColor } from "@/lib/utils";

interface StatBoxProps {
  label: string;
  value: string;
  change?: number;
  sub?: string;
}

export function StatBox({ label, value, change, sub }: StatBoxProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>
      {change !== undefined && (
        <p className={cn("mt-1 text-sm font-medium", getChangeColor(change))}>
          {formatPercent(change)}
        </p>
      )}
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

export function StatBoxUSD({
  label,
  value,
  change,
}: {
  label: string;
  value: number;
  change?: number;
}) {
  return (
    <StatBox
      label={label}
      value={formatUSD(value, true)}
      change={change}
    />
  );
}
