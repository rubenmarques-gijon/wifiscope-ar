import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "good" | "warning" | "error";
  className?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, unit, status = "good", className, icon }: MetricCardProps) {
  const statusClass = {
    good: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    error: "bg-red-50 border-red-200 text-red-700"
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border p-4 shadow-sm transition-all hover:shadow-md",
        statusClass,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-current opacity-70">{icon}</div>}
        <div className="font-medium text-sm opacity-70">{label}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-2xl font-bold">{value}</div>
        {unit && <div className="text-sm opacity-70">{unit}</div>}
      </div>
    </motion.div>
  );
}