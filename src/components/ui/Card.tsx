import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ title, children, className, action }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && (
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
