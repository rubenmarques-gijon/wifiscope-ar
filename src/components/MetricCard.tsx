import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "good" | "warning" | "error";
  className?: string;
}

export function MetricCard({ label, value, unit, status = "good", className }: MetricCardProps) {
  const statusClass = {
    good: "signal-good",
    warning: "signal-warning",
    error: "signal-error"
  }[status];

  return (
    <div className={cn("metric-card", className)}>
      <div className={cn("metric-value", statusClass)}>
        {value}
        {unit && <span className="text-base ml-1">{unit}</span>}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}