import { motion } from "framer-motion";
import { Task } from "@/hooks/useStudyData";
import { Check, Trash2 } from "lucide-react";

const difficultyColors: Record<string, string> = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-[hsl(270,60%,55%)]",
};

const priorityLabels: Record<string, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

interface TaskCardProps {
  task: Task;
  index: number;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, index, onComplete, onDelete }: TaskCardProps) {
  const deadlineStr = task.deadline.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isOverdue = task.deadline < new Date() && task.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0D0D0D] p-4 transition-all hover:border-[rgba(255,255,255,0.1)] hover:bg-[#111111]"
    >
      {/* Difficulty bar */}
      <div className={`absolute left-0 top-0 h-full w-[2px] ${difficultyColors[task.difficulty]}`} />

      {/* Inner glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-medium tracking-[-0.01em] ${task.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {task.title}
            </h3>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{task.subject}</span>
            <span>·</span>
            <span className={isOverdue ? "text-urgency font-medium" : ""}>{deadlineStr}</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{task.estimatedMinutes}m</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider ${
            task.priority === "high" ? "bg-urgency/20 text-urgency" :
            task.priority === "medium" ? "bg-warning/20 text-warning" :
            "bg-muted text-muted-foreground"
          }`}>
            {priorityLabels[task.priority]}
          </span>

          {task.status === "pending" && (
            <button
              onClick={() => onComplete(task.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-success/10 hover:text-success group-hover:opacity-100"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
