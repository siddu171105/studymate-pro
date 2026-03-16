import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="surface-card rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="mt-2">
        <span className={`text-2xl font-semibold tracking-[-0.03em] ${accent || "text-foreground"}`}>
          {value}
        </span>
      </div>
    </motion.div>
  );
}
